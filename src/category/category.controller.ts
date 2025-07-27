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
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Kategoriyalar")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: "Yangi kategoriya yaratish" })
  @ApiResponse({
    status: 201,
    description: "Kategoriya muvaffaqiyatli yaratildi",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov yoki kategoriya mavjud",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha kategoriyalarni olish" })
  @ApiResponse({ status: 200, description: "Kategoriya ro'yxati" })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha kategoriya olish" })
  @ApiParam({ name: "id", type: Number, description: "Kategoriya ID raqami" })
  @ApiResponse({ status: 200, description: "Kategoriya topildi" })
  @ApiResponse({ status: 404, description: "Kategoriya topilmadi" })
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID bo'yicha kategoriyani yangilash" })
  @ApiParam({ name: "id", type: Number, description: "Kategoriya ID raqami" })
  @ApiResponse({
    status: 200,
    description: "Kategoriya muvaffaqiyatli yangilandi",
  })
  @ApiResponse({ status: 404, description: "Kategoriya topilmadi" })
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "ID bo'yicha kategoriyani o'chirish" })
  @ApiParam({ name: "id", type: Number, description: "Kategoriya ID raqami" })
  @ApiResponse({
    status: 200,
    description: "Kategoriya muvaffaqiyatli o'chirildi",
  })
  @ApiResponse({ status: 404, description: "Kategoriya topilmadi" })
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
