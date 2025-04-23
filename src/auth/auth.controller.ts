import {
    Body,
    Controller,
    Get,
    Post, Req,
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



type RequestWithUser = Request & { user: payload; };


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {
    }

    @Public()
    @Get()
    publicAnswer() {
        return "Hihi, c'est pas protegé !";
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
        return this.authService.login(user);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@GetCurrentUser('email') email: string) {
        return this.usersService.getByEmail(email)
    }

    @UseGuards(AuthGuard)
    @Get('users')
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(RtAuthGuard)
    @Get('refresh')
    refresh(@Req() req: any) {
        const user = req.user;
        return this.authService.refreshToken(user.email, user.refreshToken);
    }

    @UseGuards(RtAuthGuard)
    @Post('refresh')
    refreshToken(
        @GetCurrentUser('email') email: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ) {
        return this.authService.refreshToken(email, refreshToken);
    }



    /*    @UseGuards(LocalAuthGuard)
        @Post('auth/logout')
        async logout(@Req() req: RequestWithUser) {
            return req.logout();
            }*/


}




