import { describe, it, expect } from 'vitest';
import {
  AddStuffSchema,
  EditStuffSchema,
  AddContactSchema,
  EditContactSchema,
  AddNoteSchema,
} from '../../src/lib/validationSchemas';

describe('Stuff validation', () => {
  const validStuff = {
    name: 'Laptop',
    quantity: 2,
    condition: 'good',
    owner: 'john@foo.com',
  };

  it('accepts valid stuff', async () => {
    await expect(
      AddStuffSchema.validate(validStuff)
    ).resolves.toBeDefined();
  });

  it('rejects missing names', async () => {
    await expect(
      AddStuffSchema.validate({ ...validStuff, name: '' })
    ).rejects.toThrow();
  });

  it('rejects negative quantities', async () => {
    await expect(
      AddStuffSchema.validate({ ...validStuff, quantity: -1 })
    ).rejects.toThrow();
  });

  it('rejects zero quantities', async () => {
    await expect(
      AddStuffSchema.validate({ ...validStuff, quantity: 0 })
    ).rejects.toThrow();
  });

  it('rejects invalid conditions', async () => {
    await expect(
      AddStuffSchema.validate({
        ...validStuff,
        condition: 'destroyed',
      })
    ).rejects.toThrow();
  });

  it('rejects SQL injection in numeric fields', async () => {
    await expect(
      AddStuffSchema.validate({
        ...validStuff,
        quantity: '1; DROP TABLE Stuff;',
      })
    ).rejects.toThrow();
  });

  it('requires an ID when editing stuff', async () => {
    await expect(
      EditStuffSchema.validate(validStuff)
    ).rejects.toThrow();
  });
});

describe('Contact validation', () => {
  const validContact = {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    image: 'https://example.com/photo.png',
    description: 'Test contact',
    owner: 'john@foo.com',
  };

  it('accepts valid contacts', async () => {
    await expect(
      AddContactSchema.validate(validContact)
    ).resolves.toBeDefined();
  });

  it('rejects missing first names', async () => {
    await expect(
      AddContactSchema.validate({
        ...validContact,
        firstName: '',
      })
    ).rejects.toThrow();
  });

  it('rejects invalid image URLs', async () => {
    await expect(
      AddContactSchema.validate({
        ...validContact,
        image: 'not-a-url',
      })
    ).rejects.toThrow();
  });

  it('rejects JavaScript URLs as images', async () => {
    await expect(
      AddContactSchema.validate({
        ...validContact,
        image: 'javascript:alert(1)',
      })
    ).rejects.toThrow();
  });

  it('requires an ID when editing contacts', async () => {
    await expect(
      EditContactSchema.validate(validContact)
    ).rejects.toThrow();
  });
});

describe('Note validation', () => {
  const validNote = {
    note: 'Remember to call John',
    contactId: 1,
    owner: 'john@foo.com',
  };

  it('accepts valid notes', async () => {
    await expect(
      AddNoteSchema.validate(validNote)
    ).resolves.toBeDefined();
  });

  it('rejects empty notes', async () => {
    await expect(
      AddNoteSchema.validate({
        ...validNote,
        note: '',
      })
    ).rejects.toThrow();
  });

  it('rejects invalid contact IDs', async () => {
    await expect(
      AddNoteSchema.validate({
        ...validNote,
        contactId: 'invalid',
      })
    ).rejects.toThrow();
  });

  it('rejects missing owners', async () => {
    await expect(
      AddNoteSchema.validate({
        ...validNote,
        owner: '',
      })
    ).rejects.toThrow();
  });
});