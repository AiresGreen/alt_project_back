
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {AppModule} from "../app.module";

@Module({
  imports: [AppModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
