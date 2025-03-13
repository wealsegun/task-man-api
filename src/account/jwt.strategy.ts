import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccountService } from './account.service';
import { JwtPayload } from '../models/interfaces/jwtPayload.interface';
import { UserProfile } from '../models/interfaces/userProfile.interface';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AccountService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: '?E(G+KbPeShVmYq3',

        });
    }

    // console.log('JWT Secret:', process.env.JWT_SECRET);
    async validate(payload: JwtPayload): Promise<UserProfile | null> {
        const account = this.authService.validateUserById(payload.userId);
        if (account) {
            console.log('JWT Secret:', process.env.JWT_SECRET);
            return account;
        } else {
            return null;
        }

    }
}