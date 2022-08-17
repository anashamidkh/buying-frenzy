import { EntityBase } from '../../common/entityBase';
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from '../restaurant/restaurant.entity';
import { User } from '../user/user.entity';

@Entity()
export class Order extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dish_name', nullable: false })
  dishName: string;

  @Index()
  @Column({ name: 'user_id', type: 'int', nullable: false })
  public userId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Index()
  @Column({ name: 'restaurant_id', type: 'int', nullable: false })
  public restaurantId: number;

  @ManyToOne((type) => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  public restaurant: Restaurant;

  @Column({ name: 'placed_on', type: 'timestamptz' })
  public placedOn: Date;

  @Column({ nullable: false, type: 'float' })
  @Check('amount > 0')
  amount: number;
}
