import { EntityBase } from '../../common/entityBase';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity()
export class User extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'cash_balance', nullable: false, type: 'double precision' })
  cashBalance: number;

  @OneToMany((type) => Order, (order) => order.user)
  public order: Order[];
}
