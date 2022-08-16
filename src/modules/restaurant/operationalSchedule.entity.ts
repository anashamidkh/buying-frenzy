import { EntityBase } from "src/common/entityBase";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@Entity('operational_schedule')
export class OperationalSchedule extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: 'restaurant_id', type: 'int', nullable: false })
    public restaurantId: number;

    @ManyToOne(type => Restaurant)
    @JoinColumn({ name: 'restaurant_id' })
    public restaurant: Restaurant;

    @Column({name: 'day', nullable: false})
    day: string;

    @Column({ name: 'open_at', type: 'time', nullable: false })
    public openAt: string;

    @Column({ name: 'close_at', type: 'time', nullable: false })
    public closeAt: string;
} 