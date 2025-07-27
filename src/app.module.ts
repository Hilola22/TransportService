import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { RegionsModule } from './regions/regions.module';
import { MailModule } from './mail/mail.module';
import { DistrictsModule } from './districts/districts.module';
import { CarModule } from './car/car.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ".env",
    isGlobal: true
  }),
  PrismaModule,
  UsersModule,
  AdminsModule,
  AuthModule,
  RegionsModule,
  MailModule,
  DistrictsModule,
  CarModule,
  CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
