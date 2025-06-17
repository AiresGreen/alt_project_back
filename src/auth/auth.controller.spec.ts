import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  const jwtMock    = { verify: jest.fn() };
  const configMock = { get: jest.fn() };

  // utilisateur simulé
  const fakeUser = { id: 1, email: 'test@example.com' };

  const authServiceMock = {
    /** renvoyé par validateUser */
    validateUser: jest.fn().mockResolvedValue(fakeUser),
    /** renvoyé par login */
    login: jest.fn().mockResolvedValue({
      accessToken: 'mocked-token',
      refreshToken: 'mocked-token',
      user: fakeUser,
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService,    useValue: authServiceMock },
        { provide: JwtService,     useValue: jwtMock },
        { provide: ConfigService,  useValue: configMock },
        { provide: UsersService,   useValue: {} },
        { provide: PrismaService,  useValue: {} },
      ],
    })
        .overrideGuard(RtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

    controller = moduleRef.get(AuthController);
  });

  it('login() renvoie un accessToken', async () => {
    // DTO simulé envoyé dans le body de la requête
    const dto = { email: 'admin@btj.io', password: 'pw' };

    const res = await controller.login(dto as any);

    expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
    );
    expect(authServiceMock.login).toHaveBeenCalledWith(fakeUser);
    expect(res).toEqual(
        expect.objectContaining({ accessToken: 'mocked-token' }),
    );
  });
});
