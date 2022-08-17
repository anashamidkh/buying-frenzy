import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { Menu } from './menu.entity';
import { OperationalSchedule } from './operationalSchedule.entity';
import { OperationalScheduleService } from './operationalSchedule.service';
import { Restaurant } from './restaurant.entity';
import { RestaurantModule } from './restaurant.module';

describe('OperationalSchedule Service', () => {
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
        entities: [OperationalSchedule, Restaurant, Menu, Order, User],
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

  it('Parse Operational Schedule', async () => {
    //Success:
    const operationalScheduleService = app.get<OperationalScheduleService>(
      OperationalScheduleService,
    );
    const resp: any = await operationalScheduleService.parseOperationalSchedule(
      'Mon 10:30 am - 3:15 pm / Tues - Weds 7:15 am - 12:30 am',
      1,
    );
    expect(resp.length == 3);
  });

  afterAll(async () => {
    await app.close();
  }, 100000);
});
