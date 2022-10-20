import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './users.model';
import { UserController } from './users.controller';
import { CloudinaryModule } from 'src/models/Cloudinary/cloudinary.module';
import { JwtStrategy } from './jwt.strategy';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CloudinaryModule,
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
    }),
    ProductsModule,
    PaymentsModule,
    OrdersModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
