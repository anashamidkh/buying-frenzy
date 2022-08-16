import { BadRequestException, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { dayNumberToDay } from "./constant";
import { GetRestaurants } from "./dtos/getRestaurants.dto";
import { GetTopRestaurants } from "./dtos/getTopRestaurants.dto";
import { Restaurant } from "./restaurant.entity";
import { RestaurantRepository } from "./restaurant.repository";

@Injectable()
export class RestaurantService {
    /**
     * 
     * @param restaurantRepository 
     */
    constructor(private restaurantRepository: RestaurantRepository) { }

    /**
     * Get Restaurants
     * @param {GetRestaurants.QueryParams} params 
     * @returns {Promise<[Restaurant[], number]>}
     */
    public async getRestaurants(params: GetRestaurants.QueryParams): Promise<[Restaurant[], number]> {
        let day = null;
        let time = null;

        if(params.dateTime) {
            day = dayNumberToDay[moment(params.dateTime).day()];
            time = moment(params.dateTime).format('HH:mm:ss');
        }

        return await this.restaurantRepository.getRestaurants(params.limit, params.offset, day, time, params.name).getManyAndCount();
    }

    /**
     * Get top restaurants
     * @param {GetTopRestaurants.QueryParams} params
     * @returns {Promise<Restaurant[]>}
     */
    public async getTopRestaurants(params: GetTopRestaurants.QueryParams): Promise<Restaurant[]> {
        if(!params?.greaterThan && !params?.lessThan) {
            throw new BadRequestException('greaterThan or lessThan must be provided in request');
        }

        return await this.restaurantRepository.getTopRestaurants(params.limit, params.minPrice, params.maxPrice, params?.greaterThan, params?.lessThan).getMany();
    }
}