import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class SignInUserDto {
  @ApiProperty({
    description: "Foydalanuvchining email manzili",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email: string;

  @ApiProperty({
    description: "Foydalanuvchining paroli",
    example: "MySecurePass123",
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @Length(6, 20, {
    message: "Parol uzunligi 6-20 belgi oralig'ida bo'lishi kerak",
  })
  password: string;
}
