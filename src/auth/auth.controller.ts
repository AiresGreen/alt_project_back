import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post, Query, Req,
    UseGuards
} from '@nestjs/common';
import {AuthService, payload} from './auth.service';
import {Request} from 'express';
import {Public} from './decorator/public.decorator';
import {SignInDto} from "./dto/sign-in.dto";
import {GetCurrentUser} from "./decorator/get-current-user.decorator";
import {SignUpDto} from "./dto/sign-up.dto";
import {UsersService} from "../users/users.service";
import {AuthGuard} from "./guards/auth.guard";
import {RtAuthGuard} from "./guards/rt-auth.guard";
import {PrismaService} from "../../prisma/prisma.service";


export type RequestWithUser = Request & { user: payload; };


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private prisma: PrismaService,
    ) {
    }

    @Public()
    @Get()
    publicAnswer() {
        return "Hihi, c'est pas protegé !";
    }

    @Public()
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        const tokenData = await this.prisma.emailVerificationToken.findUnique({
            where: {token},
            include: {user: true}
        });

        if (!tokenData || tokenData.expiresAt < new Date()) {
            throw new BadRequestException('Token invalide ou expiré.');
        }

        await this.prisma.user.update({
            where: {id: tokenData.user.id},
            data: {emailVerified: true},
        });

        await this.prisma.emailVerificationToken.delete({
            where: {token},
        });

        return {message: 'Ton adresse email a bien été vérifiée.'};
    }

    @Public()
    @Post('signin')
    async login(@Body() dto: SignInDto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        return this.authService.login(user);
    }


    @Public()
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        const user = await this.authService.createUser(signUpDto);
        await this.authService.sendEmailVerification(user);

        return {
            message: "Utilisateur créé. Veuillez vérifier votre email.",
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                emailVerified: user.emailVerified,
            }
        };
    }


    @Get('profile')
    getProfile(@GetCurrentUser('email') email: string) {
        return this.usersService.getByEmail(email)
    }


    @Get('users')
    findAll() {
        return this.usersService.findAll();
    }


    @Public()
    @UseGuards(RtAuthGuard)
    @Post('refresh')
    async refreshToken(
        @GetCurrentUser('id') userId: number,
        @GetCurrentUser('email') userEmail: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ) {
        return this.authService.refreshToken(userId, userEmail, refreshToken);

    }

    @Public()
    @UseGuards(RtAuthGuard)
    @Post('logout')
    async logout(
    @GetCurrentUser('sub') userId: number,){
        await this.authService.logout(userId);
    }



}




