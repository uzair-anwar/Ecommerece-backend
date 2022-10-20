import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CloudinaryModule } from '../Cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    CloudinaryModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
