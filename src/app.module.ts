import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './models/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenMiddleware } from './Middlewares/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './models/users/users.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'account/login', method: RequestMethod.POST },
        { path: 'account/signup', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
