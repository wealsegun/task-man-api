import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from 'src/models/entities/task.entity';
import { TaskHistory } from 'src/models/entities/task-history.entity';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/models/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), // Register the Account entity here
    TypeOrmModule.forFeature([TaskHistory]),
    AccountModule,
    TypeOrmModule.forFeature([Account]), // Register the Account entity here
    JwtModule.register({ // Configure the JwtModule
      secretOrPrivateKey: process.env.JWT_SECRET_KEY, // Use a strong secret or retrieve from config
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
  ],

  providers: [TaskService, AccountService],
  controllers: [TaskController],
  exports: [TaskService, AccountService]
})
export class TaskModule { }
