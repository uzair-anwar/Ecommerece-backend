import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    private cloudinary: CloudinaryService,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(data: CreateProductDto, files: Express.Multer.File, id: string) {
    try {
      const urls = [];

      for (let i = 0; i < Object.keys(files).length; i++) {
        const { url } = await this.cloudinary
          .uploadImage(files[0])
          .catch(() => {
            throw new BadRequestException('Invalid file type.');
          });
        urls.push(url);
      }

      const newProduct = new this.productModel({
        name: data.name,
        description: data.description,
        price: data.price,
        image: urls,
        userId: id,
      });

      const result = await newProduct.save();

      if (result) {
        return {
          status: 201,
          message: 'Product created Successfully',
        };
      } else {
        return {
          status: 400,
          message: 'Product can not be created',
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findAll() {
    try {
      const result = await this.productModel
        .find()
        .populate({ path: 'userId', select: 'name image' });
      return result;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findUserProducts(id: string) {
    try {
      const result = await this.productModel.find({ userId: id });
      return result;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findMany(name: string) {
    try {
      return await this.productModel.find({
        name: { $regex: `/${name}/`, $options: 'i' },
      });
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findOne(id: string) {
    try {
      return await this.productModel
        .findOne({
          _id: id,
        })
        .populate({ path: 'userId', select: 'name image' });
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findProductsOfOneUser(id: string) {
    try {
      return await this.productModel.find({ userId: id });
    } catch (error) {
      return error;
    }
  }

  async update(productId: string, data: UpdateProductDto, id: string) {
    try {
      const checkProduct = await this.productModel.findOne({
        _id: productId,
        userId: id,
      });
      if (checkProduct == null) {
        return {
          status: 400,
          message: 'You can not update this product',
        };
      } else {
        const result = await this.productModel.findByIdAndUpdate(
          { _id: productId },
          { name: data.name, description: data.description, price: data.price },
        );
        if (result) {
          return {
            status: 200,
            message: 'Product update successfuly',
          };
        }
      }
    } catch (error) {
      return error;
    }
  }

  //we add comments in table and id in product tabe

  async remove(productId: string, userId: string) {
    try {
      const { deletedCount } = await this.productModel.deleteOne({
        _id: productId,
        userId: userId,
      });
      if (deletedCount > 0) {
        return {
          status: 200,
          message: 'Product deleted successfully',
        };
      } else {
        return {
          status: 400,
          message: 'You can not delete this product',
        };
      }
    } catch (error) {
      return error;
    }
  }
}
