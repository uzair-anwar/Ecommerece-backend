import { MinLength, IsNotEmpty } from 'class-validator';

export class updatePassdto {
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
