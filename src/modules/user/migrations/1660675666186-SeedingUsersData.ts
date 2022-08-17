import { readFileSync } from 'fs';
import { Order } from 'src/modules/order/order.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../user.entity';

export class SeedingUsersData1660675666186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const data = JSON.parse(
      readFileSync('./src/data/users_with_purchase_history.json').toString(),
    );
    const users: User[] = [];
    const orders: Order[] = [];

    for (let item of data) {
      const user = new User();
      user.id = item.id;
      user.name = item.name;
      user.cashBalance = item.cashBalance;

      users.push(user);
    }
    await queryRunner.manager.save(users);

    let map = {};
    const restaurants = await queryRunner.query(
      'SELECT id, name from "restaurant" ',
    );
    restaurants.forEach((element) => {
      map[element.name] = element.id;
    });

    for (let k = 0; k < data.length; k++) {
      for (let historyItem of data[k].purchaseHistory) {
        let order = new Order();
        order.userId = users[k].id;
        order.dishName = historyItem.dishName;
        order.restaurantId = map[historyItem.restaurantName];
        order.placedOn = new Date(historyItem.transactionDate);
        order.amount = historyItem.transactionAmount;

        orders.push(order);
      }
    }
    await queryRunner.manager.save(orders);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "order" WHERE id >= 1`);
    await queryRunner.query(`ALTER SEQUENCE "order_id_seq" RESTART WITH 1`);

    await queryRunner.query(`DELETE FROM "user" WHERE id >= 1`);
    await queryRunner.query(`ALTER SEQUENCE "user_id_seq" RESTART WITH 1`);
  }
}
