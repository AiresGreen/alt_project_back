import {ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from "../users/users.service";
import * as argon2 from "argon2";
import {PrismaService} from "../../prisma/prisma.service";
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";
import {ConfigService} from "@nestjs/config";
import * as crypto from "crypto";
import {MailService} from "../mail/mail.service";
import {level_grade} from "@prisma/client";
import {faker} from "@faker-js/faker/locale/ar";



export type payload = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    hashedRt: string;

}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
        private mailService: MailService,
    ) {
    }

    async createUser(body: SignUpDto) {
        const hashedPassword = await argon2.hash(body.password);

        try {
            // Si aucun profil n'est fourni, on le crée automatiquement
            const profil = body.profil_id
                ? { id: body.profil_id }
                : await this.prisma.profile.create({
                    data: {
                        phone_number: faker.phone.number(),
                        picture: faker.image.avatar(),
                        street: faker.location.streetAddress(),
                        zip_code: faker.location.zipCode(),
                        city: faker.location.city(),
                    },
                });

            // Si aucun level_id n'est fourni, on récupère celui correspondant à "pas admin"
            const level = body.level_id
                ? { id: body.level_id }
                : await this.prisma.level.findFirst({
                    where: { grade: level_grade.pas_admin },
                });

            if (!level) {
                throw new InternalServerErrorException("Niveau par défaut introuvable");
            }

            return await this.prisma.user.upsert({
                where: {
                    email: body.email,
                },
                update: {},
                create: {
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    password: hashedPassword,
                    profile_id: profil.id,
                    level_id: level.id,
                    emailVerified: body.emailVerified,
                },
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Erreur lors de la création de l'utilisateur hihi id");
        }
    }


    async sendEmailVerification(user: any) {
        const token = crypto.randomBytes(32).toString('hex');

        await this.prisma.emailVerificationToken.create({
            data: {
                token,
                user: { connect: { id: user.id } },
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h,
            },
        });

        await this.mailService.sendVerificationEmail(user.email, token);
        console.log("🚀 ~ sendEmailVerification ~ this.mailService: ", this.mailService);


    }


    async signIn(body: SignInDto)/*: Promise<{ access_token: string, refresh_token:string }>*/ {
        const user = await this.usersService.getByEmail(body.email);
        if (!user || !(await argon2.verify(user.password, body.password)))
        {
            throw new UnauthorizedException("AS-signIn");
        }
        return user;
    }


    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new UnauthorizedException('Invalid credentials');
        } else if (!user.emailVerified) {
            throw new ForbiddenException("Tu dois d'abord valider ton adresse email.");
        }
        return user;
    }

    async login(user: any) {
        console.log("🚀 Loggé es tu, Maître Login");
        const tokens = await this.generateTokens(user);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                emailVerified: user.emailVerified,
            }
        };

    }


    async generateTokens(user: any) {
        const payload = {
            id: user.id,
            email: user.email,
            hashedRt: user.hashedRt
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: '3h',
        });
        //console.log("🚀 ~ generateTokens ~ accessToken: ", accessToken);

        const refreshToken =  this.jwtService.sign({sub:user.id, email:user.email} ,{
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: '1d',
        });
       // console.log("🚀 ~ generateTokens ~ refreshToken: ", refreshToken);

        const hashedRt: string = await argon2.hash(refreshToken)
       //  console.log("🚀 ~ generateTokens ~ hashedRt: ", hashedRt)

        await this.prisma.user.update({
            where: {email: user.email},
            data: {hashedRt},
        });


        return {
            accessToken,
            refreshToken,
        };

    }



    async  refreshToken(id:number, email:string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({where: {id, email}});

        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');


        const isValid = await argon2.verify(user.hashedRt, refreshToken);
        if (!isValid) throw new ForbiddenException('Access Denied');
        //console.log("🚀 ~ refreshToken ~ user.hashedRt: ", user.hashedRt);

        return this.generateTokens(user);

    }


    async logout(userId: number){

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                hashedRt: null,
            },
        });
        console.log("🚀desloggé tu es, Padawan");
    }


}

