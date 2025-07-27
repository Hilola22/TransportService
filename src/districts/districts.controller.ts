import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DistrictsService } from "./districts.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";

@ApiTags("Tumanlar")
@Controller("districts")
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi tuman yaratish" })
  @ApiResponse({ status: 201, description: "Tuman muvaffaqiyatli yaratildi" })
  @ApiResponse({ status: 400, description: "Xatolik yuz berdi" })
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha tumanlarni olish" })
  @ApiResponse({ status: 200, description: "Tumanlar ro'yxati" })
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID orqali bitta tumanni olish" })
  @ApiResponse({ status: 200, description: "Tuman topildi" })
  @ApiResponse({ status: 404, description: "Tuman topilmadi" })
  findOne(@Param("id") id: string) {
    return this.districtsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID orqali tuman ma'lumotlarini yangilash" })
  @ApiResponse({ status: 200, description: "Tuman yangilandi" })
  @ApiResponse({ status: 404, description: "Tuman topilmadi" })
  update(
    @Param("id") id: string,
    @Body() updateDistrictDto: UpdateDistrictDto
  ) {
    return this.districtsService.update(+id, updateDistrictDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "ID orqali tuman o'chirish" })
  @ApiResponse({ status: 200, description: "Tuman o'chirildi" })
  @ApiResponse({ status: 404, description: "Tuman topilmadi" })
  remove(@Param("id") id: string) {
    return this.districtsService.remove(+id);
  }
}
