import { JwtPayload } from "./jwt-payload.type";

export type JwtPayloadWithRefreshTokenAdmin = JwtPayload & { refreshToken: string };