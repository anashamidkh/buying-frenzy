import { Controller, Get, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { GetRestaurants } from "./dtos/getRestaurants.dto";
import { GetTopRestaurants } from "./dtos/getTopRestaurants.dto";
import { RestaurantService } from "./restaurant.service";

@Controller('restaurants')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRestaurants(
    @Query() queryParams: GetRestaurants.QueryParams
  ): Promise<GetRestaurants.Output> {
    const result = await this.restaurantService.getRestaurants(queryParams);
    return new GetRestaurants.Output(result[0], result[1]);
  }

  @Get('/top')
  @UsePipes(new ValidationPipe({transform: true}))
  async getTopRestaurants (
    @Query() queryParams: GetTopRestaurants.QueryParams
  ): Promise<GetTopRestaurants.Output> {
    const restaurants = await this.restaurantService.getTopRestaurants(queryParams);
    return restaurants.map((restaurant) => new GetTopRestaurants.Output(restaurant));
  }
}