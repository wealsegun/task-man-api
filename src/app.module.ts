import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { TaskHistory } from './models/entities/task-history.entity';
import { Task } from './models/entities/task.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './account/account.module';
import { Account } from './models/entities/account.entity';

const envVariable = {
  DB_HOST: process.env.DB_HOST ?? "ep-long-leaf-a5rxlvkm-pooler.us-east-2.aws.neon.tech",
  DB_PORT: process.env.DB_PORT ?? "5432",
  DB_USER: process.env.DB_USER ?? "neondb_owner",
  DB_PASSWORD: process.env.DB_PASSWORD ?? "npg_Fh0KQnkHG8ex",
  DB_NAME: process.env.DB_NAME ?? "werqAITaskManager",
  DB_SSLMODE: process.env.DB_SSLMODE ?? "require",
}

// console.log(envVariable)

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envVariable.DB_HOST,
      port: +envVariable.DB_PORT,
      username: envVariable.DB_USER,
      password: envVariable.DB_PASSWORD,
      database: envVariable.DB_NAME,
      entities: [Task, TaskHistory, Account],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Set to true in production with a valid certificate
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AccountModule,
    TaskModule,
  ],
})
export class AppModule { }