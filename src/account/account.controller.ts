import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../models/entities/account.entity';
import { ResponseUtil } from '../models/classes/response.util';
import { JwtAuthGuard } from './jwt-account.guard';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post('register')
    async createAccount(@Body() accountData: Partial<Account>) {
        const account = await this.accountService.createAccount(accountData);
        return { message: 'Account created successfully', account };
    }

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string) {
        const token = await this.accountService.login(email, password);
        return ResponseUtil.sendSuccessResponse(201, 'Login successful', token);

    }

    @Post('reset-password')
    async resetPassword(@Body('email') email: string, @Body('newPassword') newPassword: string) {
        await this.accountService.resetPassword(email, newPassword);
        return ResponseUtil.sendSuccessResponse(201, 'Password reset successfully', "");

    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async GetAccount(@Request() req) {
        const userId = req.user.userId;
        const user = await this.accountService.validateUserById(userId);
        return ResponseUtil.sendSuccessResponse(201, 'Password reset successfully', user);

    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        // Implement email sending logic here
        return { message: 'Password reset email sent' };
    }
}