import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlaceOrder } from './dtos/placeOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async placeOrder(
    @Body() params: PlaceOrder.Params,
  ): Promise<PlaceOrder.Output> {
    return await this.orderService.placeOrder(params);
  }
}
