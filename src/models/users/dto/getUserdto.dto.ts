import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class getUserdto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
