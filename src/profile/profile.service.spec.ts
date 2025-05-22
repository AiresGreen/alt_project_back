import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import {PrismaService} from "../../prisma/prisma.service";
import {faker} from "@faker-js/faker/locale/ar";


describe('ProfileService', () => {
  let service: ProfileService;


  const mockPrismaService = {
    profile: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),

    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    mockPrismaService.profile.upsert.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('upsert methode', () => {

    it('Should create profile', async () => {

      const mockProfile = {
        id: faker.number.int(),
        picture: faker.string.symbol(),
        street: faker.location.streetAddress(),
        zip_code: faker.location.zipCode(),
        city: faker.location.city(),
        phone_number: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.soon(),
      }

      const prismaResponse = {

        ...mockProfile

      }

      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);
      mockPrismaService.profile.upsert.mockResolvedValue(prismaResponse);

      const result = await service.create(mockProfile);
      console.log("🚀 ~  ~ result: ", result);


      expect(result).toEqual(prismaResponse)
      expect(mockPrismaService.profile.upsert).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.profile.upsert).toHaveBeenCalledWith({
        where: {phone_number: mockProfile.phone_number},
        update: {...mockProfile},
        create: {...mockProfile},
      })
    })


      it('Should create an error of profile', async () => {

        const mockProfile = {
          id: faker.number.int(),
          picture: faker.string.symbol(),
          street: faker.location.streetAddress(),
          zip_code: faker.location.zipCode(),
          city: faker.location.city(),
          phone_number: faker.phone.number(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.soon(),
        }

        const prismaResponse = {

          ...mockProfile

        }

        mockPrismaService.profile.findUnique.mockResolvedValue(new Error('profile not found'));
        mockPrismaService.profile.upsert.mockResolvedValue(new Error('profile not found'));

        const result = await service.create(mockProfile);
        console.log("🚀 ~  ~ result: ", result);


        expect(result).toBeInstanceOf(Error)


      })

    })


  });

