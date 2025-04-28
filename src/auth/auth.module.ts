
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import {APP_GUARD} from "@nestjs/core";
import {PassportModule} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {AuthGuard} from "./guards/auth.guard";
import {MailModule} from "../mail/mail.module";



@Module({
  imports: [
    UsersModule, MailModule,
      PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, ConfigService,

   {
    provide: APP_GUARD,
    useClass: AuthGuard,
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}