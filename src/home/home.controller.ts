import { Controller, Get,Param } from '@nestjs/common';
import { HomeService } from './home.service';
//import {Public} from './decorator/public.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService,) {}

  //@Public()
  @Get()
  findAll() {
    return this.homeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(+id);
  }

}
