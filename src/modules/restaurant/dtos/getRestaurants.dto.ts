import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { parseIntTransformer } from '../../../common/validators';
import { OperationalSchedule } from '../operationalSchedule.entity';
import { Restaurant } from '../restaurant.entity';

export namespace GetRestaurants {
  export class QueryParams {
    @ApiProperty()
    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateTime: Date;

    @ApiProperty()
    @Transform(parseIntTransformer)
    @IsInt()
    @IsPositive()
    limit: number = 20;

    @ApiProperty()
    @Transform(parseIntTransformer)
    @IsInt()
    offset: number = 0;

    @ApiProperty()
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string;
  }

  export class Output {
    constructor(restaurants: Restaurant[], totalRecords) {
      return {
        totalRecords,
        restaurants: restaurants.map(
          (restaurant) => new RestaurantsOutput(restaurant),
        ),
      };
    }
  }

  export class RestaurantsOutput {
    constructor(restaurant: Restaurant) {
      return {
        name: restaurant.name,
        cashBalance: restaurant.cashBalance,
        operationalSchedule: restaurant.operationalSchedule.map(
          (operationalSchedule) =>
            new OperationalScheduleOutput(operationalSchedule),
        ),
      };
    }
  }

  export class OperationalScheduleOutput {
    constructor(operationalSchedule: OperationalSchedule) {
      return {
        day: operationalSchedule.day,
        openAt: operationalSchedule.openAt,
        closeAt: operationalSchedule.closeAt,
      };
    }
  }
}
