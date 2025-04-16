/*

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
import { Public } from './public.decorateur';

 type RequestWithUser = Request & {user:  payload;};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get()
  publicAnswer() {
    return "Hihi, c'est pas protegé !";
  }


  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }


}
*/
