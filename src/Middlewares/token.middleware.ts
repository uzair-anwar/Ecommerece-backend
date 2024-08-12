import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    let bearer = '';

    if (typeof authorization != 'undefined') {
      bearer = authorization.replace('Bearer ', '');
    }

    if (bearer === '') {
      throw new UnauthorizedException('No Token provided!');
    }

    const id = await this.isTokenValid(bearer);

    req.id = id;

    if (!id) {
      throw new UnauthorizedException('Invalid Token!');
    }
    next();
  }

  async isTokenValid(bearerToken: string): Promise<any> {
    const verifyOptions = { secret: 'JWT_SECRET' };
    try {
      const payload = await this.jwtService.verifyAsync(
        bearerToken,
        verifyOptions,
      );
      return payload;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }
}
