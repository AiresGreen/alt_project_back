
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import {APP_GUARD} from "@nestjs/core";
import { AuthGuard } from './auth.guard';
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";

import {ConfigService} from "@nestjs/config";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {RtStrategy} from "./rt.strategy";
import {JwtStrategy} from "./jwt.strategy";


@Module({
  imports: [
    UsersModule,
      PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, ConfigService, JwtStrategy, RtStrategy,
   {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}