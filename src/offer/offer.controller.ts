import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {OfferService} from './offer.service';
import {Public} from 'src/auth/decorator/public.decorator';


@Controller('offer')
export class OfferController {
    constructor(private readonly offerService: OfferService) {
    }


    @Public()
    @Get()
    async getOfferFromFranceTravail() {
        return this.offerService.getOfferFromFranceTravail();
    }

    @Public()
    @Get(':id')
    async getOfferFromFranceTravailById(@Param('id') id: string) {
        return this.offerService.getOfferFromFranceTravailById(id);
    }

    @Get(':id')
    findById(@Param('user_id') user_id: string) {
        return this.offerService.findByUserId(+user_id);
    }


    /*  @Get()
      findAll() {
        return this.offerService.findAll();
      }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(+id);
  }*/

}
