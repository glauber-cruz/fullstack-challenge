import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import type { IncomingMessage } from "http";
import { KeycloakUser } from "@/infrastructure/types/keycloack";

export type AuthenticatedRequest = IncomingMessage & { user: KeycloakUser };

@Injectable()
export class AuthGuard implements CanActivate {
  private client = jwksClient({
    jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  });

  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const request = http.getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException("Token is required");

    const token = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!token) throw new UnauthorizedException("Token is required");

    return new Promise<boolean>((resolve, reject) => {
      jwt.verify(token, this.getKey.bind(this), {}, (err, decoded) => {
        if (err || !decoded || typeof decoded !== "object") {
          reject(new UnauthorizedException("Invalid token"));
          return;
        }
        request.user = {
          name: decoded.name as string,
          email: decoded.email as string,
          sub: decoded.sub as string,
        };
        resolve(true);
      });
    });
  }

  private getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    this.client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key?.getPublicKey();
      if (!signingKey) {
        callback(new Error("No signing key"));
        return;
      }
      callback(null, signingKey);
    });
  }
}
