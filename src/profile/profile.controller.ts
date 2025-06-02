import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':phone_number')
  findOne(@Param('phone_number') phone_number: string) {
    return this.profileService.findOne(phone_number);
  }

  @Patch(':phone_number')
  @Put(':phone_number')
  update(@Param('phone_number') phone_number: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(phone_number, updateProfileDto);
  }

  @Delete(':phone_number')
  remove(@Param('phone_number') phone_number: string) {
    return this.profileService.remove(phone_number);
  }
}

