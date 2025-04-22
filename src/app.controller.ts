import {
  Controller, Post, Req, UseGuards,
} from '@nestjs/common'
import {PrismaService} from "../prisma/prisma.service";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {AuthService, payload} from "./auth/auth.service";

type RequestWithUser = Request & {user:  payload;};

@Controller()
export class AppController {
  constructor(
      private readonly prismaService: PrismaService,
      private readonly authService: AuthService,) {}


}