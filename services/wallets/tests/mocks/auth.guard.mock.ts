import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

export const authGuardMock: CanActivate = {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException("Token is required");
    }

    request.user = {
      sub: "user-1",
      email: "john@doe.com",
      name: "John Doe",
    };

    return true;
  },
};
