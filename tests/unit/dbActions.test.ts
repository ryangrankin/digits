import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    stuff: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    contact: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    note: {
      create: vi.fn(),
    },
    user: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock('bcrypt', () => ({
  hash: vi.fn(async () => 'hashed-password'),
}));

import { prisma } from '../../src/lib/prisma';
import { hash } from 'bcrypt';
import {
  addStuff,
  editStuff,
  deleteStuff,
  createUser,
  changePassword,
  addContact,
  editContact,
  deleteContact,
  addNote,
} from '../../src/lib/dbActions';

describe('Database actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stuff operations', () => {
    const validStuff = {
      name: 'Laptop',
      quantity: 2,
      owner: 'john@foo.com',
      condition: 'good',
    };

   it('creates stuff with the correct condition', async () => {
  await expect(addStuff(validStuff))
    .rejects.toThrow('REDIRECT:/list');

  expect(prisma.stuff.create).toHaveBeenCalledWith({
    data: {
      ...validStuff,
      condition: 'good',
    },
  });
});

it.each([
  'excellent',
  'good',
  'fair',
  'poor',
])('preserves the %s condition', async (condition) => {
  await expect(
    addStuff({
      ...validStuff,
      condition,
    }),
  ).rejects.toThrow('REDIRECT:/list');

  expect(prisma.stuff.create).toHaveBeenCalledWith({
    data: {
      name: 'Laptop',
      quantity: 2,
      owner: 'john@foo.com',
      condition,
    },
  });
});

    it('updates existing stuff', async () => {
      const stuff = {
        ...validStuff,
        id: 1,
        condition: 'excellent' as const,
      };

      await expect(editStuff(stuff))
        .rejects.toThrow('REDIRECT:/list');

      expect(prisma.stuff.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Laptop',
          quantity: 2,
          owner: 'john@foo.com',
          condition: 'excellent',
        },
      });
    });

    it('deletes stuff by ID', async () => {
      await expect(deleteStuff(1))
        .rejects.toThrow('REDIRECT:/list');

      expect(prisma.stuff.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('User operations', () => {
    it('hashes passwords when creating users', async () => {
      await createUser({
        email: 'test@example.com',
        password: 'securePassword123',
      });

      expect(hash).toHaveBeenCalledWith('securePassword123', 10);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashed-password',
        },
      });
    });

    it('hashes new passwords when changing passwords', async () => {
      await changePassword({
        email: 'test@example.com',
        password: 'newPassword123',
      });

      expect(hash).toHaveBeenCalledWith('newPassword123', 10);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { password: 'hashed-password' },
      });
    });
  });

  describe('Contact operations', () => {
    const contact = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      image: 'https://example.com/photo.png',
      description: 'Test contact',
      owner: 'john@foo.com',
    };

    it('creates contacts', async () => {
      const { id, ...newContact } = contact;

      await expect(addContact(newContact))
        .rejects.toThrow('REDIRECT:/list');

      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: newContact,
      });
    });

    it('updates contacts', async () => {
      await expect(editContact(contact))
        .rejects.toThrow('REDIRECT:/list');

      expect(prisma.contact.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
        }),
      });
    });

    it('deletes contacts', async () => {
      await expect(deleteContact(1))
        .rejects.toThrow('REDIRECT:/list');

      expect(prisma.contact.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('Note operations', () => {
    it('creates notes associated with contacts', async () => {
      const note = {
        note: 'Remember to call John',
        contactId: 1,
        owner: 'john@foo.com',
      };

      await expect(addNote(note))
        .rejects.toThrow('REDIRECT:/list');

      expect(prisma.note.create).toHaveBeenCalledWith({
        data: note,
      });
    });
  });
});