import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({ example: "John Doe", description: "Admin full name" })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: "admin@example.com",
    description: "Email address of the admin",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Phone number (optional)",
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber("UZ")
  phone?: string;

  @ApiProperty({
    example: "StrongPassword123",
    description: "Password (minimum 6 characters)",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "StrongPassword123",
    description: "Confirm Password (must match password)",
  })
  @IsString()
  @MinLength(6)
  confirm_password: string;
}
