import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";

@Injectable()
export class CarService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    const { plate_number, vin_number, model, year, current_owner_id } =
      createCarDto;

    const owner = await this.prismaService.user.findUnique({
      where: { id: current_owner_id },
    });

    if (!owner) {
      throw new BadRequestException(
        `User with id ${current_owner_id} not found`
      );
    }

    return this.prismaService.car.create({
      data: {
        plate_number,
        vin_number,
        model,
        year,
        current_owner_id,
      },
    });
  }

  findAll() {
    return this.prismaService.car.findMany({
      include: {
        user: true, 
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.car.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.prismaService.car.findUnique({ where: { id } });

    if (!car) {
      throw new NotFoundException(`Car not found with id ${id}`);
    }
    if (updateCarDto.current_owner_id) {
      const owner = await this.prismaService.user.findUnique({
        where: { id: updateCarDto.current_owner_id },
      });

      if (!owner) {
        throw new BadRequestException(
          `User with id ${updateCarDto.current_owner_id} not found`
        );
      }
    }

    return this.prismaService.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  async remove(id: number) {
    const car = await this.prismaService.car.findUnique({ where: { id } });

    if (!car) {
      throw new NotFoundException(`Car not found with id ${id}`);
    }

    await this.prismaService.car.delete({ where: { id } });

    return "Car deleted successfully";
  }
}
