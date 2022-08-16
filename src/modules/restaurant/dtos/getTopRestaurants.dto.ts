import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";
import { parseFloatTransformer, parseIntTransformer } from "../../../common/validators";
import { Restaurant } from "../restaurant.entity";

export namespace GetTopRestaurants {
    export class QueryParams {
        @Transform(parseIntTransformer)
        @IsInt()
        @IsPositive()
        limit: number;               //Y

        @Transform(parseIntTransformer)
        @IsInt()
        @IsPositive()
        @IsOptional()
        greaterThan: number;

        @Transform(parseIntTransformer)
        @IsInt()
        @IsPositive()
        @IsOptional()
        lessThan: number;

        @Transform(parseFloatTransformer)
        @IsNumber()
        @IsPositive()
        minPrice: number;

        @Transform(parseFloatTransformer)
        @IsNumber()
        @IsPositive()
        maxPrice: number;
    }

    export class Output {
        constructor(restaurant: Restaurant) {
            return {
                name: restaurant.name
            }
        }
    }
}