import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './users.service';
import { createUserdto } from './dto/createUserdto.dto';
import { getUserdto } from './dto/getUserdto.dto';
import { updatePassdto } from './dto/updatePass.dto';

@Controller('account')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  async addUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: createUserdto,
  ): Promise<any> {
    const result = await this.userService.addUser(data, file);
    return result;
  }

  @Post('login')
  async login(@Body() data: getUserdto): Promise<any> {
    const result = await this.userService.login(data);
    console.log(result);
    return result;
  }

  @Post('updatePassword')
  async updatePassword(@Body() data: updatePassdto): Promise<any> {
    const result = this.userService.updatePassword(data);
    if (result) return result;
  }
}
