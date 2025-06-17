import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';   // ou le bon chemin
import * as argon2 from 'argon2';

const EMAIL_METHOD = 'findByEmail' as const; // adapte si besoin

describe('AuthService', () => {
  let authService: AuthService;

  // ------------------ Mocks principaux ------------------
  const usersMock: any = { [EMAIL_METHOD]: jest.fn() };
  const jwtMock: Partial<JwtService> = { sign: jest.fn().mockReturnValue('signed-jwt') };

  const prismaMock: any = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const configMock: any = { get: jest.fn().mockReturnValue('jwt-secret') };
  const mailMock: any   = { sendWelcome: jest.fn() };

  beforeAll(() => {
    // Neutralise réellement argon2.verify et argon2.hash
    jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    jest.spyOn(argon2, 'hash').mockResolvedValue('hashedRt');
  });

  beforeEach(async () => {
    // valeurs par défaut
    const userDb = {
      id: 1,
      email: "admin@btj.io",
      password: "AdminPassword123!",
      emailVerified: true,
    };
    usersMock[EMAIL_METHOD].mockResolvedValue(userDb);
    prismaMock.user.findUnique.mockResolvedValue(userDb);
    prismaMock.user.update.mockResolvedValue({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService,  useValue: usersMock  },
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService,    useValue: jwtMock    },
        { provide: ConfigService, useValue: configMock },
        { provide: MailService,   useValue: mailMock   },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  // ------------------ Tests -----------------------------

  it('validateUser() retourne le user sans mot de passe', async () => {
    const res = await authService.validateUser('admin@btj.io', 'pw');
    expect(res).toEqual(
        expect.objectContaining({ id: 1, email: 'admin@btj.io' }),
    );
    expect(prismaMock.user.findUnique).toHaveBeenCalled();
  });

  it('validateUser() lève Unauthorized si user absent', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(authService.validateUser('none@mail.com', 'pw')).rejects.toBeDefined();
  });

  it('login() renvoie un token et met à jour refreshToken', async () => {
    const token = await authService.login({
      id: 1,
      email: 'test@example.com',
    } as any);
    expect(token).toEqual(
        expect.objectContaining({ accessToken: 'signed-jwt' }),
    );
    expect(jwtMock.sign).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalled();
  });
});
