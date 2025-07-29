import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCarHistoryDto } from "./dto/create-car-history.dto";
import { UpdateCarHistoryDto } from "./dto/update-car-history.dto";

@Injectable()
export class CarHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarHistoryDto: CreateCarHistoryDto) {
    return this.prisma.carHistory.create({
      data: createCarHistoryDto,
    });
  }

  async findAll() {
    return this.prisma.carHistory.findMany({
      include: {
        user: true,
        car: true,
      },
    });
  }

  async findOne(id: number) {
    const carHistory = await this.prisma.carHistory.findUnique({
      where: { id },
      include: {
        user: true,
        car: true,
      },
    });
    if (!carHistory) {
      throw new NotFoundException(`CarHistory with id ${id} not found`);
    }
    return carHistory;
  }

  async update(id: number, updateCarHistoryDto: UpdateCarHistoryDto) {
    const carHistory = await this.prisma.carHistory.findUnique({
      where: { id },
    });
    if (!carHistory) {
      throw new NotFoundException(`CarHistory with id ${id} not found`);
    }
    return this.prisma.carHistory.update({
      where: { id },
      data: updateCarHistoryDto,
    });
  }

  async remove(id: number) {
    const carHistory = await this.prisma.carHistory.findUnique({
      where: { id },
    });
    if (!carHistory) {
      throw new NotFoundException(`CarHistory with id ${id} not found`);
    }
    await this.prisma.carHistory.delete({
      where: { id },
    });
    return `CarHistory with id ${id} deleted`;
  }
}
