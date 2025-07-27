import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateAdminDto, UpdateAdminDto } from "./dto";

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createAdminDto: CreateAdminDto) {
    const { full_name, email, phone, password, confirm_password } =
      createAdminDto;
    if (password !== confirm_password) {
      throw new BadRequestException("Passwords not match");
    }
    const hashedPassword = await bcrypt.hash(password!, 7);

    return this.prismaService.admin.create({
      data: {
        full_name,
        email,
        phone,
        hashedPassword,
      },
    });
  }

  findAll() {
    return this.prismaService.admin.findMany();
  }

  findOne(id: number) {
    return this.prismaService.admin.findUnique({ where: { id } });
  }

  async findAdminByActivationLink(activationLink: string) {
    return this.prismaService.admin.findFirst({ where: { activationLink } });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.prismaService.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException("This admin not found!");
    }
    return this.prismaService.admin.update({
      where: { id },
      data: updateAdminDto,
    });
  }

  async remove(id: number) {
    const admin = await this.prismaService.admin.findUnique({ where: { id } })
    if (!admin) {
      throw new NotFoundException("This admin not found!")
    }
    await this.prismaService.admin.delete({ where: { id } });
    return "Admin deleted!";
  }
}
