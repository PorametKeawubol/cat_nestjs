import { sex } from '../entities/user.entity';

export class CreateUserDto {
  firstname: string;
  lastname: string;
  age: number;
  IdentificationNo: string;
  gender: sex;
  createdAt: Date;
  updatedAt: Date;
  bio: string;
  address: string;
  password: string;
}
