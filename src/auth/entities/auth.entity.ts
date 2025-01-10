import { PrimaryGeneratedColumn, Column } from 'typeorm';

export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  userId: string;
}
