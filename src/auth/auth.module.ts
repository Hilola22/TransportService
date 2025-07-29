import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [PrismaModule, UsersModule, AdminsModule, JwtModule.register({}), MailModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
