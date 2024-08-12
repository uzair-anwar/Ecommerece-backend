import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class createUserdto {
  @MinLength(3, {
    message: 'Name is too short',
  })
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
