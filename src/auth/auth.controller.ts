import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Query,
  HttpCode,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto, SignInUserDto } from "../users/dto";
import { Response, Request } from "express";

@ApiTags("Avtorizatsiya")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({ summary: "Foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiResponse({
    status: 201,
    description:
      "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi. Iltimos, hisobni faollashtirish uchun emailingizni tekshiring.",
  })
  @ApiResponse({ status: 409, description: "Email allaqachon mavjud." })
  async signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signup(dto, res);
  }

  @Post("signin")
  @HttpCode(200)
  @ApiOperation({ summary: "Foydalanuvchi tizimga kirishi" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi tizimga muvaffaqiyatli kirdi.",
  })
  @ApiResponse({ status: 401, description: "Noto'g'ri login yoki parol." })
  async signin(
    @Body() dto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signin(dto, res);
  }

  @Post("signout")
  @HttpCode(200)
  @ApiOperation({ summary: "Foydalanuvchini tizimdan chiqish" })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi tizimdan muvaffaqiyatli chiqdi.",
  })
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.signoutUser(refreshToken, res);
  }

  @Get("refresh")
  @ApiOperation({ summary: "Yangi access token olish" })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "Access token muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 401,
    description: "Noto'g'ri yoki muddati o'tgan refresh token.",
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Get("activate")
  @ApiOperation({ summary: "Hisobni faollashtirish" })
  @ApiQuery({
    name: "link",
    description: "Faollashtirish linki (UUID)",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Hisob muvaffaqiyatli faollashtirildi.",
  })
  @ApiResponse({
    status: 404,
    description: "Noto'g'ri yoki eskirgan faollashtirish linki.",
  })
  async activate(@Query("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }
}
