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


  describe('methode findMany', () => {

    it('Should find and return all profiles', async () => {
      const mockProfile = {
        id: faker.number.int(),
        picture: faker.image.url(),
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

      mockPrismaService.profile.findMany.mockResolvedValue(mockProfile);

      const result = await service.findAll()

      expect(result).toEqual(mockProfile);
      expect(mockPrismaService.profile.findMany).toHaveBeenCalledTimes(1);
    })

    it('Should create an error no profile found', async () => {

      const mockProfile = {
        id: faker.number.int(),
        picture: faker.image.url(),
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

      mockPrismaService.profile.findMany.mockResolvedValue(new Error('Profile not found'));

      const result = await service.findAll()

      expect(result).toBeInstanceOf(Error);
    })
  })

  describe('upsert methode', () => {

    it('Should find unique tel number & update profile or create a new profile', async () => {

      const mockProfile = {
        id: 13,
        picture: faker.image.url(),
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

  describe('methode delete', ()=> {

    it('Should find unique tel number & delete profile', async () => {

      const mockProfile = {
        id: faker.number.int(),
        picture: faker.image.url(),
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
      mockPrismaService.profile.delete.mockResolvedValue(prismaResponse);

      const result = await service.remove(mockProfile.phone_number);
      console.log("🚀 ~  ~ result: ", result);


      expect(result).toEqual(prismaResponse);
      expect(mockPrismaService.profile.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.profile.delete).toHaveBeenCalledWith({
        where: { id: mockProfile.id},
      });
    })

    it('Should show an error no profile found', async () => {

      const mockProfile = {
        id: faker.number.int(),
        picture: faker.image.url(),
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

      mockPrismaService.profile.findUnique.mockResolvedValue(new Error('Profile not found'));
      mockPrismaService.profile.delete.mockResolvedValue(new Error('Profile not found'));

      const result = await service.remove(mockProfile.phone_number);
      console.log("🚀 ~  ~ result: ", result);


      expect(result).toBeInstanceOf(Error);
    })

  })


  });

