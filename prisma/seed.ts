import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  const password = await hash('changeme', 10);

  if (config.defaultContacts) {
    await Promise.all(
      config.defaultContacts.map(async (account: any) => {
        const role = (account.role as Role) || Role.USER;
        console.log(`Creating user: ${account.email} with role: ${role}`);

        await prisma.user.upsert({
          where: { email: account.email },
          update: {},
          create: {
            email: account.email,
            password,
            role,
          },
        });
      }),
    );
  }

  if (config.defaultContacts) {
    await Promise.all(
      config.defaultContacts.map(async (contact: any, index: number) => {
        console.log(`Adding contact: ${contact.firstName} ${contact.lastName}`);

        await prisma.contact.upsert({
          where: { id: index + 1 },
          update: {},
          create: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            address: contact.address,
            image: contact.image,
            description: contact.description,
            owner: contact.owner,
          },
        });
      }),
    );
  }
}

main()
  .then(async () => {
    console.log('Seeding finished.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
