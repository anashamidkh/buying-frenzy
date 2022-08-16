import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  public getRestaurants(
    limit: number,
    offset: number,
    day?: string,
    time?: string,
    name?: string,
  ): SelectQueryBuilder<Restaurant> {
    const query = this.createQueryBuilder('restaurant')
      .leftJoin('restaurant.operationalSchedule', 'operationalSchedule')
      .select([
        'restaurant.id',
        'restaurant.name',
        'restaurant.cashBalance',
        'operationalSchedule.id',
        'operationalSchedule.day',
        'operationalSchedule.openAt',
        'operationalSchedule.closeAt',
      ]);

    if (day && time) {
      query
        .andWhere('operationalSchedule.day = :day', { day })
        .andWhere(
          `('${time}' between operationalSchedule.openAt and operationalSchedule.closeAt)`,
        );
    }

    if (name) {
      query.andWhere("ts_name @@ to_tsquery('english', :name)", { name });
    }

    query.take(limit).skip(offset);
    return query;
  }

  public getTopRestaurants(
    limit: number,
    minPrice: number,
    maxPrice: number,
    greaterThan?: number,
    lessThan?: number,
  ): SelectQueryBuilder<Restaurant> {
    let value = lessThan;
    let operator = '<';

    if (greaterThan) {
      value = greaterThan;
      operator = '>';
    }

    const query = this.createQueryBuilder('restaurant')
      .innerJoin('restaurant.menus', 'menu')
      .select(['restaurant.id', 'restaurant.name'])
      .where(`(menu.price BETWEEN ${minPrice} and ${maxPrice})`)
      .groupBy('restaurant.id')
      .having(`count(menu.dishName) ${operator} :value`, { value })
      .orderBy('restaurant.name', 'ASC')
      .limit(limit);

    return query;
  }
}
