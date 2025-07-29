import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, SignInUserDto } from "../users/dto";
import { CreateAdminDto, SignInAdminDto } from "../admins/dto";
import { Request, Response } from "express";
import { ResponseFields } from "../common/types";
import { ResponseFieldsAdmin } from "../common/types/response.type-admin";
import { GetCurrentUser, GetCurrentUserId } from "../common/decorators";
import { AdminAccessTokenGuard, AdminRefreshTokenGuard, UserAccessTokenGuard, UserRefreshTokenGuard } from "../common/guards";

declare module "express" {
  interface Request {
    user: {
      id: number;
      email: string;
    };
  }
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // USER
  @Post("signup")
  async signupUser(@Body() dto: CreateUserDto) {
    return this.authService.signupUser(dto);
  }

  @Post("signin")
  async signinUser(
    @Body() dto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.signinUser(dto, res);
  }

  @UseGuards(UserRefreshTokenGuard)
  @Post("refresh")
  async refreshUser(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshUser(userId, refreshToken, res);
  }

  @UseGuards(UserRefreshTokenGuard)
  @Post("signout")
  @HttpCode(HttpStatus.OK)
  async signoutUser(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<boolean> {
    return this.authService.signoutUser(userId, res);
  }

  @Post("activate")
  async activateUser(
    @Body("activationLink") activationLink: string,
    @Body("userId") userId: number
  ) {
    if (!activationLink || !userId) {
      throw new BadRequestException("activationLink va userId talab qilinadi");
    }
    return this.authService.activateUser(activationLink, userId);
  }

  @Post("forgot-password")
  async forgotPasswordUser(@Body("email") email: string) {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    return this.authService.forgotPasswordUser(email);
  }

  @UseGuards(UserAccessTokenGuard)
  @Post("change-password")
  async changePasswordUser(
    @Req() req: Request,
    @Body("oldPassword") oldPassword: string,
    @Body("newPassword") newPassword: string
  ) {
    const userId = req.user.id;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException("Old and new passwords are required");
    }
    return this.authService.changePasswordUser(
      userId,
      oldPassword,
      newPassword
    );
  }

  // ADMIN
  @Post("signup-admin")
  async signupAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.signupAdmin(dto);
  }

  @Post("signin-admin")
  async signinAdmin(
    @Body() dto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFieldsAdmin> {
    return this.authService.signinAdmin(dto, res);
  }

  @UseGuards(AdminRefreshTokenGuard)
  @Post("refresh-admin")
  async refreshAdmin(
    @GetCurrentUserId() adminId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFieldsAdmin> {
    return this.authService.refreshAdmin(adminId, refreshToken, res);
  }

  @UseGuards(AdminRefreshTokenGuard)
  @Post("signout-admin")
  @HttpCode(HttpStatus.OK)
  async signoutAdmin(
    @GetCurrentUserId() adminId: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<boolean> {
    return this.authService.signoutAdmin(adminId, res);
  }

  @Post("activate-admin")
  async activateAdmin(
    @Body("activationLink") activationLink: string,
    @Body("adminId") adminId: number
  ) {
    if (!activationLink || !adminId) {
      throw new BadRequestException("activationLink va adminId talab qilinadi");
    }
    return this.authService.activateAdmin(activationLink, adminId);
  }

  @Post("forgot-password-admin")
  async forgotPasswordAdmin(@Body("email") email: string) {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    return this.authService.forgotPasswordAdmin(email);
  }

  @UseGuards(AdminAccessTokenGuard)
  @Post("change-password-admin")
  async changePasswordAdmin(
    @Req() req: Request,
    @Body("oldPassword") oldPassword: string,
    @Body("newPassword") newPassword: string
  ) {
    const adminId = req.user.id;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException("Old and new passwords are required");
    }
    return this.authService.changePasswordAdmin(
      adminId,
      oldPassword,
      newPassword
    );
  }
}
