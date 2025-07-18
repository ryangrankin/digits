import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  const configObj = Array.isArray(config) ? config[0] : config;
  const password = await hash('changeme', 10);

  if (configObj.defaultAccounts) {
    const userPromises = configObj.defaultAccounts.map((account: any) => {
      const role = (account.role as Role) || Role.USER;
      console.log(`  Creating user: ${account.email} with role: ${role}`);
      return prisma.user.upsert({
        where: { email: account.email },
        update: {},
        create: {
          email: account.email,
          password,
          role,
        },
      });
    });
    await Promise.all(userPromises);
  }

  if (configObj.defaultData) {
    const stuffPromises = configObj.defaultData.map((data: any, index: number) => {
      const condition = (data.condition as Condition) || Condition.good;
      console.log(`  Adding stuff: ${data.name} (${data.owner})`);
      return prisma.stuff.upsert({
        where: { id: index + 1 },
        update: {},
        create: {
          name: data.name,
          quantity: data.quantity,
          owner: data.owner,
          condition,
        },
      });
    });
    await Promise.all(stuffPromises);
  }

  if (configObj.defaultContacts) {
    const contactPromises = configObj.defaultContacts.map((contact: any, index: number) => {
      console.log(`  Adding contact: ${contact.firstName} ${contact.lastName}`);
      return prisma.contact.upsert({
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
    });
    await Promise.all(contactPromises);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
