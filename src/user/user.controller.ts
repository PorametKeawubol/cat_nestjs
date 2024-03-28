import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCatDto } from 'src/cat/dto/create-cat.dto';
import { Expose } from 'class-transformer';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SerializeOptions({ groups: ['detail', 'yourPassword'] })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post(':id/cats')
  addCatToUser(@Param('id') id: string, @Body() CreateCatDto: CreateCatDto) {
    return this.userService.addCatToUser(+id, CreateCatDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @SerializeOptions({ groups: ['detail'] })
  @Get('/nocat')
  getUsersWithoutCats() {
    return this.userService.getUsersWithoutCats();
  }

  @SerializeOptions({ groups: ['detail'] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @SerializeOptions({ groups: ['detail'] })
  @Get('/gender')
  findGender() {
    return this.userService.findGender();
  }

  @SerializeOptions({ groups: ['detail'] })
  @Get('/gender/female')
  getAverageFemaleAge() {
    return this.userService.getAverageFemaleAge();
  }

  @SerializeOptions({ groups: ['detail'] })
  @Get('/gender/avg')
  getAverageAgeByGendere() {
    return this.userService.getAverageAgeByGender();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Put(':id/cats/:catId')
  addCatToUserByID(
    @Param('id') id: string,
    @Param('catId') catId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.addCatToUserByID(+id, +catId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
