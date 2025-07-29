import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";
import { JwtPayloadAdmin } from "../types/jwt-payload-admin.type";

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(
  Strategy,
  "admin-access-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY_ADMIN!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayloadAdmin): JwtPayloadAdmin {
    console.log("request", req);
    console.log("payload", payload);
    return payload;
  }
}
