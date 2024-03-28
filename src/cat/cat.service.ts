import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Cat[]> {
    return this.catRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<Cat | null> {
    return this.catRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }

  create(cat: CreateCatDto): Promise<Cat> {
    const newCat = this.catRepository.create({ ...cat, createdAt: new Date() });
    return this.catRepository.save(newCat);
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return this.catRepository.update(
      { id },
      { ...updateCatDto, updatedAt: new Date() },
    );
  }

  async addUserToCat(id: number, addUserDto: CreateUserDto) {
    const cat = await this.catRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!cat) {
      throw new HttpException('Cat not found', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create({
      ...addUserDto,
      createdAt: new Date(),
      cats: [cat],
    });
    return this.userRepository.save(newUser);
  }

  async addUserToCatByID(
    id: number,
    userId: number,
    updateCatDto: UpdateCatDto,
  ) {
    const cat = await this.catRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!cat) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    }

    cat.user = user;
    return this.catRepository.save(cat).then(() => cat);
  }
}
