import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique, comparePassword } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  comparePassword: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique },
  },
}));

vi.mock('bcrypt', () => ({
  compare: comparePassword,
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: (options: any) => ({
    id: 'credentials',
    type: 'credentials',
    ...options,
  }),
}));

import authOptions from '../../src/lib/authOptions';

describe('Authentication configuration', () => {
  const provider = authOptions.providers[0] as any;

  const authorize = (credentials: any) =>
    provider.authorize(credentials, {});

  const user = {
    id: 1,
    email: 'john@foo.com',
    password: 'hashed-password',
    role: 'USER',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Credential authorization', () => {
    it('rejects missing credentials', async () => {
      expect(await authorize(undefined)).toBeNull();
      expect(findUnique).not.toHaveBeenCalled();
    });

    it('rejects missing passwords', async () => {
      expect(
        await authorize({ email: 'john@foo.com' }),
      ).toBeNull();
    });

    it('rejects missing emails', async () => {
      expect(
        await authorize({ password: 'password123' }),
      ).toBeNull();
    });

    it('rejects nonexistent users', async () => {
      findUnique.mockResolvedValue(null);

      expect(
        await authorize({
          email: 'unknown@foo.com',
          password: 'password123',
        }),
      ).toBeNull();

      expect(comparePassword).not.toHaveBeenCalled();
    });

    it('rejects incorrect passwords', async () => {
      findUnique.mockResolvedValue(user);
      comparePassword.mockResolvedValue(false);

      expect(
        await authorize({
          email: user.email,
          password: 'wrong-password',
        }),
      ).toBeNull();
    });

    it('authenticates valid credentials', async () => {
      findUnique.mockResolvedValue(user);
      comparePassword.mockResolvedValue(true);

      const result = await authorize({
        email: user.email,
        password: 'correct-password',
      });

      expect(result).toEqual({
        id: '1',
        email: 'john@foo.com',
        randomKey: 'USER',
      });

      expect(comparePassword).toHaveBeenCalledWith(
        'correct-password',
        'hashed-password',
      );
    });
  });

  describe('JWT and session callbacks', () => {
    it('adds user information to the JWT', async () => {
      const result = await (authOptions.callbacks!.jwt as any)({
        token: { email: user.email },
        user: {
          id: '1',
          randomKey: 'USER',
        },
      });

      expect(result).toMatchObject({
        email: user.email,
        id: '1',
        randomKey: 'USER',
      });
    });

    it('preserves an existing JWT without a user', async () => {
      const token = {
        id: '1',
        randomKey: 'USER',
      };

      const result = await (authOptions.callbacks!.jwt as any)({
        token,
      });

      expect(result).toEqual(token);
    });

    it('adds token information to the session', async () => {
      const result = await (authOptions.callbacks!.session as any)({
        session: {
          user: { email: user.email },
          expires: '2099-01-01',
        },
        token: {
          id: '1',
          randomKey: 'USER',
        },
      });

      expect(result.user).toEqual({
        email: user.email,
        id: '1',
        randomKey: 'USER',
      });
    });
  });
});