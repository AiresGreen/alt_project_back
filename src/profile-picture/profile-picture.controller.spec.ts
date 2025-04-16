import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureController', () => {
  let controller: ProfilePictureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilePictureController],
      providers: [ProfilePictureService],
    }).compile();

    controller = module.get<ProfilePictureController>(ProfilePictureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
