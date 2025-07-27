import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RegionsService } from "./regions.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("Viloyatlar")
@Controller("regions")
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi viloyat yaratish" })
  @ApiResponse({
    status: 201,
    description: "Viloyat muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({ status: 400, description: "Yaratishda xatolik yuz berdi." })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha viloyatlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Viloyatlar ro'yxati. (districtlar bilan)",
  })
  findAll() {
    return this.regionsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID orqali viloyatni olish (districtlar bilan)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Viloyat topildi." })
  @ApiResponse({ status: 404, description: "Viloyat topilmadi." })
  findOne(@Param("id") id: string) {
    return this.regionsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Viloyat ma'lumotlarini yangilash" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Viloyat yangilandi." })
  @ApiResponse({
    status: 404,
    description: "Yangilanishda xatolik yoki viloyat topilmadi.",
  })
  update(@Param("id") id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionsService.update(+id, updateRegionDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Viloyatni o'chirish" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Viloyat o'chirildi." })
  @ApiResponse({ status: 404, description: "Viloyat topilmadi." })
  remove(@Param("id") id: string) {
    return this.regionsService.remove(+id);
  }
}
