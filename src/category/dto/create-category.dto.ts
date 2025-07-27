import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
    example: "Tanirovka",
    description: "Xizmat turi",
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
