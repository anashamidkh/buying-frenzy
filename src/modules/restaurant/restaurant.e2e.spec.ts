import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { Menu } from '../restaurant/menu.entity';
import { OperationalSchedule } from '../restaurant/operationalSchedule.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { User } from '../user/user.entity';
import { GetRestaurants } from './dtos/getRestaurants.dto';
import { GetTopRestaurants } from './dtos/getTopRestaurants.dto';
import { RestaurantController } from './restaurant.controller';

describe('Restaurant Service', () => {
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
        entities: [Restaurant, Menu, OperationalSchedule, Order, User],
        synchronize: false,
        logging: true,
        autoLoadEntities: false,
      }),
      inject: [ConfigService],
    }),
    RestaurantModule,
  ];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: imports,
    }).compile();
  });

  it('Get Restaurants', async () => {
    //Success:
    const queryParams = new GetRestaurants.QueryParams();
    queryParams.dateTime = new Date('2022-08-15 14:32:00');
    queryParams.limit = 3;
    queryParams.offset = 0;

    const restaurantController =
      app.get<RestaurantController>(RestaurantController);
    const resp: any = await restaurantController.getRestaurants(queryParams);
    expect(resp.restaurants.length > 0);
    expect(resp.totalRecords > 0);
  });

  it('Get Restaurants by relevant name', async () => {
    //Success:
    const queryParams = new GetRestaurants.QueryParams();
    queryParams.name = 'mexican';

    const restaurantController =
      app.get<RestaurantController>(RestaurantController);
    const resp: any = await restaurantController.getRestaurants(queryParams);
    expect(resp.restaurants.length > 0);
    expect(resp.totalRecords > 0);
  });

  it('Get Top Restaurants', async () => {
    const queryParams = new GetTopRestaurants.QueryParams();
    queryParams.limit = 3;
    queryParams.minPrice = 10.15;
    queryParams.maxPrice = 15;

    const restaurantController =
      app.get<RestaurantController>(RestaurantController);

    //Exception:
    try {
      await restaurantController.getTopRestaurants(queryParams);
    } catch (err) {
      expect(err.message).toBe(
        'greaterThan or lessThan must be provided in request',
      );
    }
    //Success:
    queryParams.greaterThan = 1;
    const resp: any = await restaurantController.getTopRestaurants(queryParams);
    expect(resp.length > 0);
  });

  afterAll(async () => {
    await app.close();
  }, 100000);
});
