import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  emial: string;
}
