import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { OperationalSchedule } from './operationalSchedule.entity';
import { OperationalScheduleService } from './operationalSchedule.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './restaurant.entity';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Restaurant,
      RestaurantRepository,
      Menu,
      OperationalSchedule,
    ]),
  ],
  providers: [RestaurantService, OperationalScheduleService],
  controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
