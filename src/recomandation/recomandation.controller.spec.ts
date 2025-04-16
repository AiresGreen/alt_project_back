import { Test, TestingModule } from '@nestjs/testing';
import { RecomandationController } from './recomandation.controller';
import { RecomandationService } from './recomandation.service';

describe('RecomandationController', () => {
  let controller: RecomandationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecomandationController],
      providers: [RecomandationService],
    }).compile();

    controller = module.get<RecomandationController>(RecomandationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
