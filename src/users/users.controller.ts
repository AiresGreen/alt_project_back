import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {GetCurrentUser} from "../auth/decorator/get-current-user.decorator";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetCurrentUser('email') email: string) {
    return {
      message: 'Voici ton profil',
      email,
    };
  }
}