import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const regions = await this.prisma.regions.findUnique({ where: { id: createDistrictDto.regionId } })
    if (!regions) {
      throw new NotFoundException("Bunday foydalanuvchi mavjud emas!")
    }
    return this.prisma.districts.create({
      data: {
        name: createDistrictDto.name,
        regionId: createDistrictDto.regionId
      }
    });
  }

  async findAll() {
    return this.prisma.districts.findMany({
      include: {
        regions: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.districts.findUnique({
      where: { id },
      include: {
        regions: true,
      },
    });
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return this.prisma.districts.update({
      where: { id },
      data: updateDistrictDto,
    });
  }

  async remove(id: number) {
    return this.prisma.districts.delete({
      where: { id },
    });
  }
}
