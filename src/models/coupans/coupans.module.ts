import { Module } from '@nestjs/common';
import { CoupansService } from './coupans.service';
import { CoupansController } from './coupans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoupanSchema } from './coupans.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Coupan', schema: CoupanSchema }]),
  ],
  controllers: [CoupansController],
  providers: [CoupansService],
  exports: [CoupansService],
})
export class CoupansModule {}
