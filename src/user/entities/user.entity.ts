import { Expose } from 'class-transformer';
import { Cat } from 'src/cat/entities/cat.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
export enum sex {
  Male = 'Male',
  Female = 'Female',
  Nonspecified = 'Non-specified',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Expose({ groups: ['detail'] })
  @Column({ nullable: true })
  bio: string;

  @Expose({ groups: ['detail'] })
  @Column({ nullable: true })
  address: string;

  @Expose({ groups: ['detail'] })
  @Column()
  age: number;

  @Expose({ groups: ['detail'] })
  @Column({ unique: true })
  IdentificationNo: string;

  @Expose({ groups: ['detail'] })
  @Column({ type: 'enum', enum: sex, nullable: true })
  gender: sex;

  @Expose({ groups: ['yourPassword'] })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => Cat, (cat) => cat.user, { nullable: true, cascade: true })
  cats: Cat[];
}
