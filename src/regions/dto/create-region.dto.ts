import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRegionDto {
    @ApiProperty({
        example: "Toshkent shahri",
        description: "Viloyat nomlari"
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
