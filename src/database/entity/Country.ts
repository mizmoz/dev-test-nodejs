import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
@Unique(['code'])
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ length: 4 })
  code!: string;

  @Column({ nullable: true })
  population!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}