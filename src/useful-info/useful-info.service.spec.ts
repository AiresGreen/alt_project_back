import { Test, TestingModule } from '@nestjs/testing';
import { UsefulInfoService } from './useful-info.service';

describe('UsefulInfoService', () => {
  let service: UsefulInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsefulInfoService],
    }).compile();

    service = module.get<UsefulInfoService>(UsefulInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
