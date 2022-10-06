import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.model';
import { CloudinaryService } from 'src/models/Cloudinary/cloudinary.service';
import { comparePassword, generateHashPassword } from './users.providers';

@Injectable()
export class UserService {
  constructor(
    private cloudinary: CloudinaryService,
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
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

        const newAccount = new this.userModel({
          name: data.name,
          email: data.email,
          password: hashPassword,
          image: url,
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
      if (result) {
        const isMatch = await comparePassword(
          data.password,
          result.password,
        ).catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
        if (isMatch) {
          console.log(result);
          const access_token = this.jwtService.sign(result.email);
          const user = {
            status: 200,
            result,
            access_token,
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

  async getUser(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async updatePassword(data: any) {
    const { id, oldPassword, newPassword } = data;

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
