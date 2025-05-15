import { Test, TestingModule } from '@nestjs/testing';
import { UsefulInfoController } from './useful-info.controller';
import { UsefulInfoService } from './useful-info.service';

describe('UsefulInfoController', () => {
  let controller: UsefulInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsefulInfoController],
      providers: [UsefulInfoService],
    }).compile();

    controller = module.get<UsefulInfoController>(UsefulInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
