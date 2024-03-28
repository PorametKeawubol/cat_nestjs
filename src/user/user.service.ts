import {
  HttpException,
  HttpStatus,
  Injectable,
  SerializeOptions,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Cat } from 'src/cat/entities/cat.entity';
import { CreateCatDto } from 'src/cat/dto/create-cat.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['cats'] });
  }

  @SerializeOptions({ groups: ['detail'] })
  findGender(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('users')
      .select('gender')
      .groupBy('gender')
      .getMany();
  }

  async getAverageFemaleAge(): Promise<number> {
    const avgAge = await this.userRepository
      .createQueryBuilder('user')
      .select('AVG(user.age)', 'average_age_female')
      .where('user.gender = :gender', { gender: 'Female' })
      .getRawOne();

    return avgAge.average_age_female;
  }

  async getAverageAgeByGender(): Promise<
    { gender: string; average_age: number }[]
  > {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const results = await queryBuilder
      .select('user.gender', 'gender')
      .addSelect('AVG(user.age)', 'average_age')
      .groupBy('user.gender')
      .getRawMany();

    return results;
  }

  async findUsersWithoutCats() {}

  @SerializeOptions({ groups: ['detail'] })
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cats'],
    });
  }

  async remove(id: number) {
    const uesrEn = await this.userRepository.findOne({
      where: { id },
      relations: ['cats'],
    });

    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'cats')
      .of(id)
      .remove(uesrEn.cats);
    return await this.userRepository.delete(id);
  }

  @SerializeOptions({ groups: ['detail', 'yourPassword'] })
  create(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      ...user,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      { id },
      { ...updateUserDto, updatedAt: new Date() },
    );
  }

  async addCatToUser(id: number, addcat: CreateCatDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException('User not  found', HttpStatus.BAD_REQUEST);
    const newcat = this.catRepository.create({
      ...addcat,
      updatedAt: new Date(),
      user,
    });
    return this.catRepository.save(newcat);
  }

  async addCatToUserByID(
    id: number,
    catId: number,
    updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['cats'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const cat = await this.catRepository.findOne({ where: { id: catId } });
    if (!cat) {
      throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    }

    user.cats = [...user.cats, cat];
    return this.userRepository.save(user).then(() => user);
  }

  async getUsersWithoutCats(): Promise<User[]> {
    const queryBuilder: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user');

    const usersWithoutCats = await queryBuilder
      .leftJoinAndSelect('user.cats', 'cat')
      .where('cat.id IS  NULL') //NOT NULL to userที่มีcats
      .getMany();

    return usersWithoutCats;
  }
}
