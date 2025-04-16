import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesService } from './hobbies.service';

describe('HobbiesService', () => {
  let service: HobbiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HobbiesService],
    }).compile();

    service = module.get<HobbiesService>(HobbiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
