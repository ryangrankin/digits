import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

import {
  loggedInProtectedPage,
  adminProtectedPage,
} from '../../src/lib/page-protection';

const adminSession = {
  user: {
    email: 'admin@foo.com',
    id: '1',
    randomKey: 'ADMIN',
  },
};

const userSession = {
  user: {
    email: 'john@foo.com',
    id: '2',
    randomKey: 'USER',
  },
};

describe('Page protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Logged-in protection', () => {
    it('redirects unauthenticated users', () => {
      expect(() => loggedInProtectedPage(null))
        .toThrow('REDIRECT:/auth/signin');
    });

    it('allows regular users', () => {
      expect(() => loggedInProtectedPage(userSession))
        .not.toThrow();
    });

    it('allows administrators', () => {
      expect(() => loggedInProtectedPage(adminSession))
        .not.toThrow();
    });

    it('rejects sessions with empty emails', () => {
      const invalidSession = {
        user: { email: '', id: '3', randomKey: 'USER' },
      };

      expect(() => loggedInProtectedPage(invalidSession))
        .toThrow('REDIRECT:/auth/signin');
    });
  });

  describe('Admin protection', () => {
    it('redirects unauthenticated users', () => {
      expect(() => adminProtectedPage(null))
        .toThrow('REDIRECT:/auth/signin');
    });

    it('blocks regular users', () => {
      expect(() => adminProtectedPage(userSession))
        .toThrow('REDIRECT:/not-authorized');
    });

    it('allows administrators', () => {
      expect(() => adminProtectedPage(adminSession))
        .not.toThrow();
    });

    it('rejects forged role values', () => {
      const forgedSession = {
        user: {
          email: 'attacker@example.com',
          id: '4',
          randomKey: 'admin',
        },
      };

      expect(() => adminProtectedPage(forgedSession))
        .toThrow('REDIRECT:/not-authorized');
    });
  });
});