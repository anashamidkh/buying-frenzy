import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { parseIntTransformer } from '../../../common/validators';

export namespace PlaceOrder {
  export class Params {
    @ApiProperty()
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    userId: number;

    @ApiProperty()
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    restaurantId: number;

    @ApiProperty()
    @IsString()
    dishName: string;
  }

  export class Output {
    constructor(
      orderId: number,
      restaurantName: string,
      dishName: string,
      amount: number,
      userName,
    ) {
      return {
        orderId,
        restaurantName,
        dishName,
        amount,
        userName,
      };
    }
  }
}
