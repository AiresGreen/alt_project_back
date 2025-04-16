
import {Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import {UsersService} from "../users/users.service";


export type payload = {
    id: number;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async signIn(
        email: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.getByEmail(email);
        if (user?.password !== pass) {
            throw new UnauthorizedException("AS-signIn");
        }
        const payload: payload = {id: user.id, email: user.email};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}

