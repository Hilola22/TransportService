import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.regions.create({
      data: createRegionDto,
    });
  }

  findAll() {
    return this.prisma.regions.findMany({
      include: { districts: true },
    });
  }

  async findOne(id: number) {
    const region = await this.prisma.regions.findUnique({
      where: { id },
      include: { districts: true },
    });
    if (!region) {
      throw new NotFoundException(`Region #${id} not found`);
    }
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const region = await this.prisma.regions.findUnique({ where: { id } });
    if (!region) {
      throw new NotFoundException(`Region #${id} not found`);
    }

    return this.prisma.regions.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: number) {
    const region = await this.prisma.regions.findUnique({ where: { id } });
    if (!region) {
      throw new NotFoundException(`Region #${id} not found`);
    }

    await this.prisma.regions.delete({ where: { id } });
    return { message: "Region deleted successfully" };
  }
}
