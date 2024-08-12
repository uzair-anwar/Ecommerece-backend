import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsNotEmpty()
  items: Array<any>;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsString()
  @IsNotEmpty()
  cardNo: string;

  @IsString()
  @IsNotEmpty()
  stripeId: string;
}
