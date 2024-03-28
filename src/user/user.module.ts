import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from 'src/cat/entities/cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cat])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
