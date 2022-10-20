import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ID } from '../../decorators/id.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @ID() id: string) {
    return this.ordersService.create(createOrderDto, id);
  }

  @Get()
  findAll(@ID() id: string) {
    return this.ordersService.findAll(id);
  }
}
