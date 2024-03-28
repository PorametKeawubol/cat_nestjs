import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('cat')
export class CatController {
  constructor(private catService: CatService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.catService.findAll();
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }
  @Post(':id/user')
  addUserToCat(@Param('id') id: string, @Body() CreateUserDto: CreateUserDto) {
    return this.catService.addUserToCat(+id, CreateUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catService.update(+id, updateCatDto);
  }

  @Put(':id/user/:userId')
  addUserToCatByID(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catService.addUserToCatByID(+id, +userId, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catService.remove(+id);
  }
}
