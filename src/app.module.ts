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
import { ProductsModule } from './models/products/products.module';
import { ProductsController } from './models/products/products.controller';
import { PaymentsController } from './models/payments/payments.controller';
import { OrdersController } from './models/orders/orders.controller';
import { PaymentsModule } from './models/payments/payments.module';
import { OrdersModule } from './models/orders/orders.module';
import { CoupansModule } from './models/coupans/coupans.module';

@Module({
  imports: [
    UserModule,
    ProductsModule,
    PaymentsModule,
    OrdersModule,
    CoupansModule,
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
        { path: 'products/all', method: RequestMethod.GET },
        { path: 'products/searchitems/:name', method: RequestMethod.GET },
        { path: 'products/getsearchitem/:id', method: RequestMethod.GET },
      )
      .forRoutes(
        UserController,
        ProductsController,
        PaymentsController,
        OrdersController,
      );
  }
}
