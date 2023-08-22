import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      console.log(bearer !== 'Bearer' || !token);

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'The user is unauthorized!',
        });
      }
      const user = this.jwtService.verify(token);
      console.log(user);
      req.user = user;

      return true;
    } catch (err) {
      console.log(err.message);

      throw new UnauthorizedException({ message: 'The user is unauthorized!' });
    }
  }
}
