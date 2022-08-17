import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../restaurant/menu.entity';
import { OperationalSchedule } from '../restaurant/operationalSchedule.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { PlaceOrder } from './dtos/placeOrder.dto';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderModule } from './order.module';

describe('Order Service', () => {
  let app: TestingModule;

  const imports = [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<any>('DATABASE_TYPE'),
        host: configService.get<any>('DATABASE_REPLICA_HOST'),
        port: configService.get<any>('DATABASE_REPLICA_PORT'),
        username: configService.get<any>('DATABASE_REPLICA_USERNAME'),
        password: configService.get<any>('DATABASE_REPLICA_PASSWORD'),
        database: configService.get<any>('DATABASE_REPLICA_NAME'),
        entities: [Order, User, Restaurant, Menu, OperationalSchedule],
        synchronize: false,
        logging: true,
        autoLoadEntities: false,
      }),
      inject: [ConfigService],
    }),
    OrderModule,
    RestaurantModule,
    UserModule,
  ];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: imports,
    }).compile();
  });

  it('Place Order', async () => {
    //Success:
    const params = new PlaceOrder.Params();
    params.userId = 1;
    params.dishName = 'Postum cereal coffee';
    params.restaurantId = 1;

    const postController = app.get<OrderController>(OrderController);
    const resp: any = await postController.placeOrder(params);
    expect(resp.dishName == `Postum cereal coffee`).toBe(true);
    expect(resp.restaurantName == `'Ulu Ocean Grill and Sushi Lounge`).toBe(
      true,
    );

    //User not found
    try {
      params.userId = 5395939;
      await postController.placeOrder(params);
    } catch (err) {
      expect(err.message).toBe('Invalid user id');
    }

    //Dish not found
    try {
      params.dishName = 'Test 123';
      await postController.placeOrder(params);
    } catch (err) {
      expect(err.message).toBe(
        "Test 123 not found in menu of 'Ulu Ocean Grill and Sushi Lounge",
      );
    }

    //Invalid restaurant id:
    try {
      params.restaurantId = 200000;
      await postController.placeOrder(params);
    } catch (err) {
      expect(err.message).toBe('Invalid restaurant id');
    }
  });

  afterAll(async () => {
    await app.close();
  }, 100000);
});
