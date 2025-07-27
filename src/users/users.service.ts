import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { full_name, email, phone, password, confirm_password } = createUserDto;
    if (password !== confirm_password) {
      throw new BadRequestException("Passwords not match");
    }
    const hashedPassword = await bcrypt.hash(password!, 7);

    return this.prismaService.user.create({
      data: {
        full_name,
        email,
        phone,
        hashedPassword,
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({where: {id}});
  }

  async findUserByActivationLink(activationLink: string) {
    return this.prismaService.user.findFirst({where: { activationLink }});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException("This user not found!")
    }
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("This user not found!");
    }
    await this.prismaService.user.delete({ where: { id } });
    return "User deleted!";
  }
}
