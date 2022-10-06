import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    let bearer = '';

    console.log('object');

    if (typeof authorization != 'undefined') {
      bearer = authorization.replace('Bearer ', '');
    }

    if (bearer === '') {
      throw new UnauthorizedException('No Token provided!');
    }

    const isValid = this.isTokenValid(bearer);

    if (!isValid) {
      throw new UnauthorizedException('Invalid Token!');
    }
    next();
  }

  isTokenValid(bearerToken: string): boolean {
    const verifyOptions = { secret: 'JWT_SECRET' };
    let isValid = false;
    try {
      const payload = this.jwtService.verifyAsync(bearerToken, verifyOptions);
      console.log(payload, '1');

      if (payload) isValid = true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
    return isValid;
  }
}
