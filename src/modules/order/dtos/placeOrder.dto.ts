import { Transform } from 'class-transformer';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { parseIntTransformer } from 'src/common/validators';

export namespace PlaceOrder {
  export class Params {
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    userId: number;

    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    restaurantId: number;

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
