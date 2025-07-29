import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";
import { JwtPayloadWithRefreshTokenAdmin } from "../types/jwt-payload-refresh-admin.type ";

export const cookieExtractorAdmin: JwtFromRequestFunction = (req: Request) => {
  console.log(req.cookies);
  if (req && req.cookies) {
    return req.cookies["refreshToken"];
  }
  return null;
};

@Injectable()
export class RefrershTokenCookieStrategyAdmin extends PassportStrategy(
  Strategy,
  "admin-refresh-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractorAdmin,
      secretOrKey: process.env.REFRESH_TOKEN_KEY_ADMIN!,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshTokenAdmin {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ForbiddenException("Refresh token noto'g'ri");
    }
    return { ...payload, refreshToken };
  }
}
