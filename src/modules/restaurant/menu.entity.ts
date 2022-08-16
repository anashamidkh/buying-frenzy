import { EntityBase } from 'src/common/entityBase';
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class Menu extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dish_name', nullable: false })
  dishName: string;

  @Column({ nullable: false, type: 'float' })
  @Check('price > 0')
  price: number;

  @Index()
  @Column({ name: 'restaurant_id', type: 'int', nullable: false })
  public restaurantId: number;

  @ManyToOne((type) => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  public restaurant: Restaurant;
}
