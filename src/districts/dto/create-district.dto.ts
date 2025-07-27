import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDistrictDto {
  @ApiProperty({
    example: "Toshkent shahri",
    description: "Tumanlar nomlari",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: "Viloyat idsi",
  })
  @IsNumber()
  @IsNotEmpty()
  regionId: number;
}
