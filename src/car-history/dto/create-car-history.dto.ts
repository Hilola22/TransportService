import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsDateString } from "class-validator";

export class CreateCarHistoryDto {
  @ApiProperty({ example: 1, description: "Car ID" })
  @IsInt()
  carId: number;

  @ApiProperty({
    example: "2025-07-29T12:00:00Z",
    description: "Car buying date",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  buyed_at?: string;

  @ApiProperty({
    example: "2025-08-29T12:00:00Z",
    description: "Car selling date",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  sold_at?: string;

  @ApiProperty({ example: 5, description: "Owner user ID", required: false })
  @IsOptional()
  @IsInt()
  ownerId: number;
}
