import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  Matches,
  IsEnum,
} from "class-validator";
import { Role } from "../../../generated/prisma";

export class CreateUserDto {
  @ApiProperty({
    description: "Foydalanuvchining to'liq ismi",
    minLength: 2,
    maxLength: 50,
    example: "Ali Valiyev",
  })
  @IsString()
  @Length(2, 50)
  full_name: string;

  @ApiProperty({
    description: "Email manzili",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Telefon raqam (ixtiyoriy), format: +998XXXXXXXXX",
    required: false,
    example: "+998901234567",
  })
  @IsOptional()
  @Matches(/^\+998\d{9}$/, {
    message: "Telefon raqam noto'g'ri formatda",
  })
  phone?: string;

  @ApiProperty({
    description: "Foydalanuvchi roli",
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role, { message: "Noto'g'ri rol kiritildi" })
  role: Role;

  @ApiProperty({
    description: "Parol (6-20 belgidan iborat)",
    minLength: 6,
    maxLength: 20,
    example: "StrongPass123",
  })
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    description: "Parolni tasdiqlash (password bilan bir xil bo'lishi kerak)",
    minLength: 6,
    maxLength: 20,
    example: "StrongPass123",
  })
  @IsString()
  @Length(6, 20)
  confirm_password: string;
}
