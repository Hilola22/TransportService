import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, SignInUserDto } from "../users/dto";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async getTokenKeys(role: string) {
    switch (role) {
      case "USER":
        return {
          accessKey: process.env.ACCESS_TOKEN_USER_KEY,
          refreshKey: process.env.REFRESH_TOKEN_USER_KEY,
        };
      case "OWNER":
        return {
          accessKey: process.env.ACCESS_TOKEN_OWNER_KEY,
          refreshKey: process.env.REFRESH_TOKEN_OWNER_KEY,
        };
      case "CLIENT":
        return {
          accessKey: process.env.ACCESS_TOKEN_CLIENT_KEY,
          refreshKey: process.env.REFRESH_TOKEN_CLIENT_KEY,
        };
      case "ADMIN":
        return {
          accessKey: process.env.ACCESS_TOKEN_ADMIN_KEY,
          refreshKey: process.env.REFRESH_TOKEN_ADMIN_KEY,
        };
      case "SUPERADMIN":
        return {
          accessKey: process.env.ACCESS_TOKEN_SUPERADMIN_KEY,
          refreshKey: process.env.REFRESH_TOKEN_SUPERADMIN_KEY,
        };
      default:
        throw new Error("Invalid role for token keys");
    }
  }

  private async generateTokens(userOrAdmin: any, role: string) {
    const payload = {
      id: userOrAdmin.id,
      email: userOrAdmin.email,
      role,
    };

    const { accessKey, refreshKey } = await this.getTokenKeys(role);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessKey,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshKey,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signup(createUserDto: CreateUserDto, res: Response) {
    const { email, password } = createUserDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException("Bunday email allaqachon mavjud");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        hashedPassword,
        activationLink,
      },
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException("Error sending message!");
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        hashedPassword: newUser.hashedPassword,
      },
      newUser.role
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.user.update({
      where: { id: newUser.id },
      data: { hashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return {
      message:
        "User registered successfully. Please activate your account via email.",
      id: newUser.id,
      accessToken,
      role: newUser.role,
    };
  }

  async signin(signinDto: SignInUserDto, res: Response) {
    const { email, password } = signinDto;
    let authUser: {
      id: number;
      email: string;
      role: string;
      hashedPassword: string;
    };
    let role = "";
    let user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      const valid = await bcrypt.compare(password, user.hashedPassword);
      if (!valid) throw new UnauthorizedException("Password is incorrect");

      role = user.role;
      authUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        hashedPassword: user.hashedPassword,
      };
    } else {
      const admin = await this.prismaService.admin.findUnique({
        where: { email },
      });
      if (!admin) throw new UnauthorizedException("User not found");

      const valid = await bcrypt.compare(password, admin.hashedPassword);
      if (!valid) throw new UnauthorizedException("Password is incorrect");

      role = admin.is_creator ? "SUPERADMIN" : "ADMIN";
      authUser = {
        id: admin.id,
        email: admin.email,
        role,
        hashedPassword: admin.hashedPassword,
      };
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      authUser,
      role
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    if (role === "ADMIN" || role === "SUPERADMIN") {
      await this.prismaService.admin.update({
        where: { id: authUser.id },
        data: { hashedRefreshToken },
      });
    } else {
      await this.prismaService.user.update({
        where: { id: authUser.id },
        data: { hashedRefreshToken },
      });
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return { message: "User signed in", id: authUser.id, accessToken, role };
  }

  async signoutUser(refreshToken: string, res: Response) {
    const decoded = this.jwtService.decode(refreshToken) as any;
    const role = decoded.role;

    const { refreshKey } = await this.getTokenKeys(role);
    let userData: any;

    try {
      userData = this.jwtService.verify(refreshToken, { secret: refreshKey });
    } catch (error) {
      throw new BadRequestException("Token expired or invalid");
    }

    if (!userData) {
      throw new ForbiddenException("Invalid token");
    }

    if (role === "ADMIN" || role === "SUPERADMIN") {
      await this.prismaService.admin.update({
        where: { id: userData.id },
        data: { hashedRefreshToken: null },
      });
    } else {
      await this.prismaService.user.update({
        where: { id: userData.id },
        data: { hashedRefreshToken: null },
      });
    }

    res.clearCookie("refreshToken");
    return { message: "Logged out successfully" };
  }

  async refreshTokens(oldRefreshToken: string, res: Response) {
    const decoded = this.jwtService.decode(oldRefreshToken) as any;
    const role = decoded?.role;

    if (!role) {
      throw new UnauthorizedException("Invalid token payload");
    }

    const { refreshKey } = await this.getTokenKeys(role);
    let userData: any;

    try {
      userData = this.jwtService.verify(oldRefreshToken, {
        secret: refreshKey,
      });
    } catch (err) {
      throw new UnauthorizedException("Refresh token noto‘g‘ri yoki eskirgan");
    }

    const user =
      role === "ADMIN" || role === "SUPERADMIN"
        ? await this.prismaService.admin.findUnique({
            where: { id: userData.id },
          })
        : await this.prismaService.user.findUnique({
            where: { id: userData.id },
          });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException("User mavjud emas yoki token yo‘q");
    }

    const tokenMatches = await bcrypt.compare(
      oldRefreshToken,
      user.hashedRefreshToken
    );
    if (!tokenMatches) {
      throw new ForbiddenException("Token mos emas");
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      userData,
      role
    );
    const newHashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    if (role === "ADMIN" || role === "SUPERADMIN") {
      await this.prismaService.admin.update({
        where: { id: user.id },
        data: { hashedRefreshToken: newHashedRefreshToken },
      });
    } else {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken: newHashedRefreshToken },
      });
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return { accessToken, role };
  }

  async activate(activationLink: string) {
    const user = await this.prismaService.user.findFirst({
      where: { activationLink },
    });

    if (!user) {
      throw new NotFoundException(
        "Aktivatsiya havolasi noto'g'ri yoki mavjud emas"
      );
    }

    if (user.is_active) {
      throw new BadRequestException("Hisob allaqachon aktivlashtirilgan");
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        is_active: true,
        activationLink: null,
      },
    });

    return { message: "Hisob muvaffaqiyatli aktivlashtirildi" };
  }
}