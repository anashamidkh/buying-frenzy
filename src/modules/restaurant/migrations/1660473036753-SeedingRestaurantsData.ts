import { readFileSync } from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Menu } from '../menu.entity';
import { OperationalSchedule } from '../operationalSchedule.entity';
import { OperationalScheduleService } from '../operationalSchedule.service';
import { Restaurant } from '../restaurant.entity';

export class SeedingRestaurantsData1660473036753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const data = JSON.parse(
      readFileSync('./src/data/restaurant_with_menu.json').toString(),
    );

    const restaurants: Restaurant[] = [];
    let operationalSchedule: OperationalSchedule[] = [];
    const menus: Menu[] = [];
    const operationalScheduleService = new OperationalScheduleService();

    for (let item of data) {
      let restaurant: Restaurant = new Restaurant();
      restaurant.name = item.restaurantName;
      restaurant.cashBalance = item.cashBalance;
      restaurants.push(restaurant);
    }
    await queryRunner.manager.save(restaurants);

    for (let k = 0; k < data.length; k++) {
      for (let menuItem of data[k].menu) {
        let menu = new Menu();
        menu.dishName = menuItem.dishName;
        menu.price = menuItem.price;
        menu.restaurantId = restaurants[k].id;
        menus.push(menu);
      }

      operationalSchedule = [
        ...operationalSchedule,
        ...operationalScheduleService.parseOperationalSchedule(
          data[k].openingHours,
          restaurants[k].id,
        ),
      ];
    }
    await queryRunner.manager.save(operationalSchedule);
    await queryRunner.manager.save(menus);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "operational_schedule" WHERE id >= 1`);
    await queryRunner.query(
      `ALTER SEQUENCE "operational_schedule_id_seq" RESTART WITH 1`,
    );

    await queryRunner.query(`DELETE FROM "menu" WHERE id >= 1`);
    await queryRunner.query(`ALTER SEQUENCE "menu_id_seq" RESTART WITH 1`);

    await queryRunner.query(`DELETE FROM "restaurant" WHERE id >= 1`);
    await queryRunner.query(
      `ALTER SEQUENCE "restaurant_id_seq" RESTART WITH 1`,
    );
  }
}
