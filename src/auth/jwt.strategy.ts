import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {ExtractJwt, Strategy, StrategyOptionsWithRequest} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super(<StrategyOptionsWithRequest>{
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_ACCESS_SECRET'),
        });
    }

    async validate(payload: any) {
        return payload; // ou { sub, email }
    }
}