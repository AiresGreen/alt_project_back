import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorator/public.decorator";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector,
    private configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;


        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);

        if (!accessToken) {
            throw new UnauthorizedException("Information is not good. You shall no pass.");
        }
        try {
            const secret = this.configService.get('JWT_ACCESS_SECRET');
            request['user'] = await this.jwtService.verifyAsync(accessToken, { secret });
        } catch (error) {
            throw new UnauthorizedException("You shall no pass, that's all.");
        }

        return true;

    }



    private extractTokenFromHeader(request: Request):string | undefined {
        const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? accessToken: undefined;
    }
}

