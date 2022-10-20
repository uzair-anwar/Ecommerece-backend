import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ID } from 'src/decorators/id.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() files: Express.Multer.File,
    @Body() data: CreateProductDto,
    @ID() id: string,
  ): Promise<any> {
    return this.productsService.create(data, files, id);
  }

  @Get('userproducts')
  async findUserProducts(@ID() id: string) {
    return await this.productsService.findUserProducts(id);
  }

  @Get('all')
  async findAll() {
    console.log('hello');
    return await this.productsService.findAll();
  }

  @Get('searchitems/:name')
  async findMany(@Param('name') name: string) {
    return await this.productsService.findMany(name);
  }

  @Get('getsearchitem/:id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() data: UpdateProductDto,
    @ID() id: string,
  ) {
    return await this.productsService.update(productId, data, id);
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: string, @ID() id: string) {
    return await this.productsService.remove(productId, id);
  }
}
