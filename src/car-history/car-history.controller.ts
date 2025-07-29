import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CarHistoryService } from "./car-history.service";
import { CreateCarHistoryDto } from "./dto/create-car-history.dto";
import { UpdateCarHistoryDto } from "./dto/update-car-history.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("Mashina tarixi")
@Controller("car-history")
export class CarHistoryController {
  constructor(private readonly carHistoryService: CarHistoryService) {}

  @Post()
  @ApiOperation({ summary: "Yangi car history yozuvini yaratish" })
  @ApiResponse({
    status: 201,
    description: "Car history muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ma'lumot yuborildi." })
  create(@Body() createCarHistoryDto: CreateCarHistoryDto) {
    return this.carHistoryService.create(createCarHistoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha car history yozuvlarini olish" })
  @ApiResponse({ status: 200, description: "Car history yozuvlari ro'yxati." })
  findAll() {
    return this.carHistoryService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha car history yozuvini olish" })
  @ApiParam({ name: "id", type: Number, description: "Car history ID" })
  @ApiResponse({ status: 200, description: "Car history topildi." })
  @ApiResponse({ status: 404, description: "Car history topilmadi." })
  findOne(@Param("id") id: string) {
    return this.carHistoryService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Car history yozuvini yangilash" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Yangilanishi kerak bo'lgan car history ID",
  })
  @ApiResponse({ status: 200, description: "Car history yangilandi." })
  @ApiResponse({ status: 404, description: "Car history topilmadi." })
  update(
    @Param("id") id: string,
    @Body() updateCarHistoryDto: UpdateCarHistoryDto
  ) {
    return this.carHistoryService.update(+id, updateCarHistoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Car history yozuvini o'chirish" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "O'chirilishi kerak bo'lgan car history ID",
  })
  @ApiResponse({ status: 200, description: "Car history o'chirildi." })
  @ApiResponse({ status: 404, description: "Car history topilmadi." })
  remove(@Param("id") id: string) {
    return this.carHistoryService.remove(+id);
  }
}
