import {Body, Controller, Get, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

/*  @Public()
  @Post('signup')
  async createUser(@Body() body: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    profilId: number;
    levelId: number;}) {
    return this.usersService.createUser(body);
  }*/ //transfer dans auth
}
