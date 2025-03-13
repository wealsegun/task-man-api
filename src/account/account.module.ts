import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from 'src/models/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    AccountModule,
    PassportModule,
    TypeOrmModule.forFeature([Account]), // Register the Account entity here
    JwtModule.register({ // Configure the JwtModule
      secretOrPrivateKey: process.env.JWT_SECRET_KEY, // Use a strong secret or retrieve from config
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
  ],

  providers: [AccountService, JwtStrategy],
  controllers: [AccountController],
  exports: [AccountService], // Optionally export the service if used in other modules
})
export class AccountModule { }