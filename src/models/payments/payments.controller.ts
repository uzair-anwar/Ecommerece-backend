import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createAccount(@Body() data: CreateAccountDto) {
    return await this.paymentsService.createAccount(data);
  }

  @Post()
  async createCharge(@Body() data: CreatePaymentDto) {
    return await this.paymentsService.charge(
      data.amount,
      data.paymentMethodId,
      data.stripeId,
    );
  }
}
