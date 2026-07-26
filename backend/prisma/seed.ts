import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  // 1. Seed default super admin
  const adminEmail1 = 'admin@conversa.ai';
  const hashedPassword1 = await bcrypt.hash('admin_password', 10);
  const admin1 = await prisma.admin.upsert({
    where: { email: adminEmail1 },
    update: {},
    create: {
      email: adminEmail1,
      name: 'Super Admin',
      password: hashedPassword1,
    },
  });
  console.log('Admin user created:', admin1.email);

  // 2. Seed custom user super admin
  const adminEmail2 = 'joshuaomatsuli01@gmail.com';
  const hashedPassword2 = await bcrypt.hash('Jos@56567', 10);
  const admin2 = await prisma.admin.upsert({
    where: { email: adminEmail2 },
    update: {
      password: hashedPassword2, // Make sure password is up to date if they reseed
    },
    create: {
      email: adminEmail2,
      name: 'Joshua Omatsuli',
      password: hashedPassword2,
    },
  });
  console.log('Admin user created:', admin2.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
