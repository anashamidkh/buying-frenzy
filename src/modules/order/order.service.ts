import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { getConnection } from 'typeorm';
import { Restaurant } from '../restaurant/restaurant.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PlaceOrder } from './dtos/placeOrder.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  /**
   *
   * @param {RestaurantService} restaurantService
   * @param {UserService} userService
   */
  constructor(
    private restaurantService: RestaurantService,
    private userService: UserService,
  ) {}

  /**
   * Place Order
   * @param {PlaceOrder.Params} params
   * @returns {Promise<PlaceOrder.Output>}
   */
  public async placeOrder(
    params: PlaceOrder.Params,
  ): Promise<PlaceOrder.Output> {
    const restaurant = await this.restaurantService.getRestaurantAndMenuById(
      params.restaurantId,
    );

    if (!restaurant) {
      throw new BadRequestException('Invalid restaurant id');
    }

    const dish = restaurant.menus.find(
      (item) => item.dishName == params.dishName,
    );
    if (!dish) {
      throw new BadRequestException(
        `${params.dishName} not found in menu of ${restaurant.name}`,
      );
    }

    const user = await this.userService.getUserById(params.userId);

    if (!user) {
      throw new BadRequestException('Invalid user id');
    }

    const updatedUserCashBalance = +(user.cashBalance - dish.price).toFixed(2);
    if (updatedUserCashBalance < 0) {
      throw new BadRequestException('User does not have enough cash balance');
    }

    const updatedRestaurantCashBalance = +(
      restaurant.cashBalance + dish.price
    ).toFixed(2);

    const newOrder = this.createOrderObject(
      user.id,
      dish.dishName,
      restaurant.id,
      dish.price,
    );

    await getConnection().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(newOrder);
      await transactionalEntityManager.update(User, user.id, {
        cashBalance: updatedUserCashBalance,
      });
      await transactionalEntityManager.update(Restaurant, restaurant.id, {
        cashBalance: updatedRestaurantCashBalance,
      });
    });

    return new PlaceOrder.Output(
      newOrder.id,
      restaurant.name,
      dish.dishName,
      dish.price,
      user.name,
    );
  }

  /**
   * Create order object
   * @param {number} userId
   * @param {string} dishName
   * @param {number} restaurantId
   * @param {number} amount
   * @returns {Order}
   */
  private createOrderObject(
    userId: number,
    dishName: string,
    restaurantId: number,
    amount: number,
  ): Order {
    var utcMoment = moment.utc();
    var utcDateNow = new Date(utcMoment.format());

    const _order = new Order();
    _order.userId = userId;
    _order.dishName = dishName;
    _order.restaurantId = restaurantId;
    _order.placedOn = utcDateNow;
    _order.amount = amount;

    return _order;
  }
}
