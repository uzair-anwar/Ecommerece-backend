import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './orders.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(data: CreateOrderDto, id: string) {
    try {
      const result = await this.paymentsService.charge(
        data.price,
        data.paymentMethodId,
        data.stripeId,
      );

      const items = [];
      if (result.id) {
        for (const { _id } of data.items) {
          items.push(_id);
        }

        const newOrder = new this.orderModel({
          price: data.price,
          items,
          userId: id,
          paymentId: result.id,
          cardNo: data.cardNo,
        });

        const res = await newOrder.save();
        if (res) {
          return {
            status: 200,
            message: 'Order completed.',
          };
        }
      } else {
        return {
          status: 400,
          message: 'Payment issue',
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  }

  async findAll(id: string) {
    try {
      const result = await this.orderModel.find({ userId: id });
      return result;
    } catch (error) {
      return {
        status: 400,
        messsage: error,
      };
    }
  }

  async findOrdersOfOneUser(id: string) {
    try {
      return await this.orderModel.find({ userId: id });
    } catch (error) {
      return {
        status: 200,
        message: error,
      };
    }
  }
}
