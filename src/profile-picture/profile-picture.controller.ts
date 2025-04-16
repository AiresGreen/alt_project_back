import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilePictureService } from './profile-picture.service';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';

@Controller('profile-picture')
export class ProfilePictureController {
  constructor(private readonly profilePictureService: ProfilePictureService) {}

  @Post()
  create(@Body() createProfilePictureDto: CreateProfilePictureDto) {
    return this.profilePictureService.create(createProfilePictureDto);
  }

  @Get()
  findAll() {
    return this.profilePictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilePictureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfilePictureDto: UpdateProfilePictureDto) {
    return this.profilePictureService.update(+id, updateProfilePictureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilePictureService.remove(+id);
  }
}
