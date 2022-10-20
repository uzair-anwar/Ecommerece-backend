import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCoupanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsString()
  expireDate: string;
}
