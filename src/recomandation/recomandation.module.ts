import { Module } from '@nestjs/common';
import { RecomandationService } from './recomandation.service';
import { RecomandationController } from './recomandation.controller';

@Module({
  controllers: [RecomandationController],
  providers: [RecomandationService],
})
export class RecomandationModule {}
