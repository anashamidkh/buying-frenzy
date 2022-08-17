import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import {
  parseFloatTransformer,
  parseIntTransformer,
} from '../../../common/validators';
import { Restaurant } from '../restaurant.entity';

export namespace GetTopRestaurants {
  export class QueryParams {
    @ApiProperty()
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    limit: number; //Y

    @ApiProperty()
    @ApiPropertyOptional()
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    @IsOptional()
    greaterThan: number;

    @ApiProperty()
    @ApiPropertyOptional()
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    @IsOptional()
    lessThan: number;

    @ApiProperty()
    @Transform(parseFloatTransformer)
    @IsNumber()
    @IsPositive()
    minPrice: number;

    @ApiProperty()
    @Transform(parseFloatTransformer)
    @IsNumber()
    @IsPositive()
    maxPrice: number;
  }

  export class Output {
    constructor(restaurant: Restaurant) {
      return {
        name: restaurant.name,
      };
    }
  }
}
