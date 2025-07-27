import { IsNotEmpty, IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCarDto {
  @ApiProperty({
    example: "01A123AA",
    description: "Avtomobilning davlat raqami (gosnomer)",
  })
  @IsNotEmpty({ message: "Davlat raqami bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Davlat raqami matn ko'rinishida bo'lishi kerak" })
  plate_number: string;

  @ApiProperty({
    example: "1HGCM82633A123456",
    description: "Avtomobilning VIN raqami (shassi raqami)",
  })
  @IsNotEmpty({ message: "VIN raqami bo'sh bo'lmasligi kerak" })
  @IsString({ message: "VIN raqami matn bo'lishi kerak" })
  vin_number: string;

  @ApiProperty({
    example: "Chevrolet Cobalt",
    description: "Avtomobil modeli",
  })
  @IsNotEmpty({ message: "Model nomi bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Model matn shaklida bo'lishi kerak" })
  model: string;

  @ApiProperty({
    example: "2022",
    description: "Avtomobil ishlab chiqarilgan yil",
  })
  @IsNotEmpty({ message: "Yil bo'sh bo'lmasligi kerak" })
  @IsString({ message: 'Yil matn shaklida berilishi kerak (masalan: "2022")' })
  year: string;

  @ApiProperty({
    example: 3,
    description: "Avtomobilning hozirgi egasining ID raqami",
  })
  @IsNotEmpty({ message: "Ega IDsi bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Ega IDsi raqam bo'lishi kerak" })
  current_owner_id: number;
}
