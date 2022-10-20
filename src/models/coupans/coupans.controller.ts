import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CoupansService } from './coupans.service';
import { CreateCoupanDto } from './dto/create-coupan.dto';

@Controller('coupans')
export class CoupansController {
  constructor(private readonly coupansService: CoupansService) {}

  @Post()
  create(@Body() createCoupanDto: CreateCoupanDto) {
    return this.coupansService.create(createCoupanDto);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.coupansService.findOne(name);
  }
}
