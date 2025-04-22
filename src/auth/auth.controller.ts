import {
    Body,
    Controller, ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Post, Req, UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import {AuthService, payload} from './auth.service';
import {Request} from 'express';
import {Public} from './decorator/public.decorator';
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {RtGuard} from "./rt.guard";
import {GetCurrentUser} from "./decorator/get-current-user.decorator";
import {AuthGuard} from "./auth.guard";


type RequestWithUser = Request & { user: payload; };


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {
    }

    @Public()
    @Get()
    publicAnswer() {
        return "Hihi, c'est pas protegé !";
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }


    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async createUser(@Body() signUpDto: SignUpDto) {
        return this.authService.createUser(signUpDto);
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    refreshTokens(
        @GetCurrentUser('email') email: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ) {
        return this.authService.refreshTokens(email, refreshToken);
    }

    @UseGuards(RtGuard)
    @Post('auth/login')
    async login(@Req() req: RequestWithUser) {
        return this.authService.login(req.user);
    }


    /*    @UseGuards(LocalAuthGuard)
        @Post('auth/logout')
        async logout(@Req() req: RequestWithUser) {
            return req.logout();
            }*/


}




