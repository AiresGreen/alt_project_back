
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


@Module({
  imports: [
    UsersModule,
      PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy,
   {
    provide: APP_GUARD,
    useClass: AuthGuard,
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}