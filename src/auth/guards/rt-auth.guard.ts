import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorator/public.decorator";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class RtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector,
                private configService: ConfigService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const refreshToken = this.extractTokenFromHeader(request);
        console.log('Headers:', request.headers);
        console.log('Refresh Token:', refreshToken);

        if (!refreshToken) {
            throw new UnauthorizedException("Information is not good. You shall no pass.");
        }
       // console.log('Headers après:', request.headers);
       // console.log('Refresh Token après:', refreshToken);
        try {
            const secret = this.configService.get('JWT_REFRESH_SECRET');
            const payload = await this.jwtService.verifyAsync(refreshToken, {secret});
           // console.log('REFRESH PAYLOAD:', payload);
            //console.log('TOKEN FROM HEADER:', refreshToken);


            request ['user'] ={
                ...payload,
                refreshToken,
                id: payload.id
            };


        } catch (error) {
            //console.error('JWT REFRESH ERROR:', error);

            throw new UnauthorizedException("You shall no pass, that's all. + refreshguard");
        }
        return true;

    }


    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, refreshToken] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? refreshToken : undefined;
    }
}
