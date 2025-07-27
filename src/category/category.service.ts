import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const existingCategory = await this.prismaService.category.findUnique({
      where: { name },
    });
    if (existingCategory) {
      throw new BadRequestException("Category with this name already exists");
    }

    return this.prismaService.category.create({
      data: {
        name,
      },
    });
  }

  findAll() {
    return this.prismaService.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    await this.prismaService.category.delete({
      where: { id },
    });
    return { message: "Category successfully deleted" };
  }
}
