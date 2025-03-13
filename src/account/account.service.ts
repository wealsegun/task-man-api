import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Account, Role } from 'src/models/entities/account.entity';
import { ModelFactory } from 'src/models/classes/modelFactory';
import { UserProfile, UserProfileResponse } from 'src/models/interfaces/userProfile.interface';
import { JwtPayload } from 'src/models/interfaces/jwtPayload.interface';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private jwtService: JwtService,
    ) { }

    async createAccount(accountData: Partial<Account>): Promise<Account> {
        const existingAccount = await this.accountRepository.findOne({ where: { email: accountData.email } });
        if (existingAccount) {
            throw new ConflictException('Email already exists');
        }

        // Ensure password is defined
        if (!accountData.password) {
            throw new Error('Password is required');
        }

        const hashedPassword = await bcrypt.hash(accountData.password, 10);
        const account = this.accountRepository.create({
            ...accountData,
            password: hashedPassword,
            role: accountData.role || Role.USER, // Default to USER if no role provided
        });
        return await this.accountRepository.save(account);
    }

    async resetPassword(email: string, newPassword: string): Promise<void> {
        const account = await this.accountRepository.findOne({ where: { email } });
        if (!account) {
            throw new NotFoundException('Account not found');
        }

        // Ensure new password is defined
        if (!newPassword) {
            throw new Error('New password is required');
        }

        account.password = await bcrypt.hash(newPassword, 10);
        await this.accountRepository.save(account);
    }

    async login(email: string, password: string): Promise<UserProfileResponse | undefined> {
        const account = await this.accountRepository.findOne({ where: { email } });
        if (!account || !(await bcrypt.compare(password, account.password))) {
            throw new NotFoundException('Invalid credentials');
        } else {
            const payload: JwtPayload = { email: account.email, userId: account.id, role: account.role };

            console.log(payload);
            const token = this.jwtService.sign(payload, { secret: `${process.env.JWT_SECRET}` });
            const response = await ModelFactory.getUserProfile(token, "", account);
            return response;
        }
    }

    async findAccountByEmail(email: string): Promise<Account> {
        const account = await this.accountRepository.findOne({ where: { email } });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }

    async findByIds(ids: string[]): Promise<Account[]> {
        return await this.accountRepository.findBy({ id: In(ids) }); // Use In from typeorm
    }

    async validateUserById(userId: string): Promise<UserProfile | null> {
        const user = await this.accountRepository.findOne({ where: { id: userId } });
        if (user) {
            // Optionally, you can exclude the password or other sensitive information
            const { password, ...result } = user;
            return result; // Return the user without the password
        }
        return null; // User not found
    }
}