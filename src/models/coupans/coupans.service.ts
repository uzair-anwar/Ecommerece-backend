import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupan } from './coupans.model';
import { CreateCoupanDto } from './dto/create-coupan.dto';

@Injectable()
export class CoupansService {
  constructor(
    @InjectModel('Coupan') private readonly coupanModel: Model<Coupan>,
  ) {}
  async create(data: CreateCoupanDto) {
    try {
      const newCoupan = new this.coupanModel({
        name: data.name,
        discount: data.discount,
        expireDate: data.expireDate,
      });
      const result = await newCoupan.save();
      return result;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findOne(name: string) {
    return await this.coupanModel.findOne({ name });
  }
}
