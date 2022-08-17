import { EntityBase } from '../../common/entityBase';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { OperationalSchedule } from './operationalSchedule.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Restaurant extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'cash_balance', nullable: false, type: 'double precision' })
  cashBalance: number;

  @OneToMany((type) => Menu, (menus) => menus.restaurant)
  public menus: Menu[];

  @OneToMany(
    (type) => OperationalSchedule,
    (operationalSchedule) => operationalSchedule.restaurant,
  )
  public operationalSchedule: OperationalSchedule[];

  @OneToMany((type) => Order, (order) => order.restaurant)
  public order: Order[];
}
