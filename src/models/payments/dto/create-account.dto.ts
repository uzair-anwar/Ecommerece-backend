import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  exp_month: string;

  @IsString()
  @IsNotEmpty()
  exp_year: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;
}
