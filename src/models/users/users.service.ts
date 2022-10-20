import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.model';
import { CloudinaryService } from 'src/models/Cloudinary/cloudinary.service';
import { comparePassword, generateHashPassword } from './users.providers';
import { ProductsService } from '../products/products.service';
import { PaymentsService } from '../payments/payments.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class UserService {
  constructor(
    private cloudinary: CloudinaryService,
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  async addUser(data: any, file: Express.Multer.File) {
    try {
      const { url } = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      const duplicate = await this.userModel.find({ email: data.email }).exec();

      if (duplicate.length > 0) {
        return { status: 409, message: 'User already exists' };
      } else {
        const hashPassword = await generateHashPassword(data.password);
        const stripeCustomer = await this.paymentsService.createCustomer(
          data.name,
          data.email,
        );
        const newAccount = new this.userModel({
          name: data.name,
          email: data.email,
          password: hashPassword,
          image: url,
          stripeId: stripeCustomer.id,
        });

        const result = await newAccount.save();
        if (result) {
          return {
            status: 201,
            message: 'Account created Successfully',
          };
        } else {
          return {
            status: 400,
            message: 'Account can not be created',
          };
        }
      }
    } catch (error) {
      return { status: 400, message: error };
    }
  }

  async login(data: any) {
    try {
      const result = await this.userModel.findOne({ email: data.email }).exec();
      console.log(result);
      if (result != null) {
        const isMatch = await comparePassword(
          data.password,
          result.password,
        ).catch(() => {
          throw new BadRequestException('Error in comparison');
        });
        if (isMatch) {
          const token = this.jwtService.sign(result._id.toString());
          const user = {
            status: 200,
            result,
            token,
            message: 'Successfully Login',
          };
          return user;
        } else {
          return { status: 400, message: 'Password is not matched' };
        }
      } else {
        return { status: 400, message: 'User is not exist' };
      }
    } catch (error) {
      return { status: 400, message: error };
    }
  }

  async getUser(id: string) {
    try {
      const result = await this.userModel.findOne({ _id: id }).exec();
      return result;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async updatePassword(id: string, data: any) {
    const { oldPassword, newPassword } = data;

    const user = await this.userModel.findOne({ id }).exec();
    comparePassword(oldPassword, user.password).then(async (response) => {
      if (response) {
        const hashedPassword = generateHashPassword(newPassword);
        const query = { id };
        const result = await this.userModel.findOneAndUpdate(query, {
          password: hashedPassword,
        });
        if (result) {
          return {
            status: 200,
            message: 'Password update successfully',
          };
        } else {
          return {
            status: 401,
            message: 'Password can not be update',
          };
        }
      } else {
        return {
          status: 401,
          message: 'Old Password is not matched',
        };
      }
    });
  }
  catch(error) {
    return {
      status: 401,
      message: error.message,
    };
  }
}
