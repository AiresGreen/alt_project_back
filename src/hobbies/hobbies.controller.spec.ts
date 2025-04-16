import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesController } from './hobbies.controller';
import { HobbiesService } from './hobbies.service';

describe('HobbiesController', () => {
  let controller: HobbiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HobbiesController],
      providers: [HobbiesService],
    }).compile();

    controller = module.get<HobbiesController>(HobbiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
