import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class EntityBase {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  public deletedAt: Date;
}
