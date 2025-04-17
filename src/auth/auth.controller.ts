import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post, Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import {AuthService, payload} from './auth.service';
import { Request } from 'express';
import { Public } from './public.decorator';
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";



 type RequestWithUser = Request & {user:  payload;};



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @UseGuards(AuthGuard) //pas utile parce que APP_GUARD
  @Get('profile')
    getProfile(@Req()
    req: RequestWithUser
  )
    {
      return req.user;
    }
  }




