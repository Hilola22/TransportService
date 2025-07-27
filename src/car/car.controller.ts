import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CarService } from "./car.service";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";

@ApiTags("Mashinalar")
@Controller("car")
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: "Yangi mashina yaratish" })
  @ApiResponse({ status: 201, description: "Mashina muvaffaqiyatli yaratildi" })
  @ApiResponse({ status: 400, description: "Yaratishda xatolik yuz berdi" })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha mashinalarni olish" })
  @ApiResponse({ status: 200, description: "Mashinalar ro'yxati" })
  findAll() {
    return this.carService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha mashina olish" })
  @ApiParam({ name: "id", type: Number, description: "Mashina ID raqami" })
  @ApiResponse({ status: 200, description: "Mashina topildi" })
  @ApiResponse({ status: 404, description: "Mashina topilmadi" })
  findOne(@Param("id") id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID bo'yicha mashinani yangilash" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Yangilanadigan mashina ID si",
  })
  @ApiResponse({
    status: 200,
    description: "Mashina muvaffaqiyatli yangilandi",
  })
  @ApiResponse({ status: 404, description: "Mashina topilmadi" })
  update(@Param("id") id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "ID bo'yicha mashinani o'chirish" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "O'chiriladigan mashina ID si",
  })
  @ApiResponse({
    status: 200,
    description: "Mashina muvaffaqiyatli o'chirildi",
  })
  @ApiResponse({ status: 404, description: "Mashina topilmadi" })
  remove(@Param("id") id: string) {
    return this.carService.remove(+id);
  }
}
