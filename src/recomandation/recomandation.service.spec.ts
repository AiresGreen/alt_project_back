import { Test, TestingModule } from '@nestjs/testing';
import { RecomandationService } from './recomandation.service';

describe('RecomandationService', () => {
  let service: RecomandationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecomandationService],
    }).compile();

    service = module.get<RecomandationService>(RecomandationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
