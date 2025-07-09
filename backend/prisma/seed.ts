import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed confession categories
  const confessionCategories = await Promise.all([
    prisma.confessionCategory.upsert({
      where: { name: 'Academic' },
      update: {},
      create: {
        name: 'Academic',
        description: 'Study and course related confessions'
      }
    }),
    prisma.confessionCategory.upsert({
      where: { name: 'Social' },
      update: {},
      create: {
        name: 'Social',
        description: 'Social life and relationships'
      }
    }),
    prisma.confessionCategory.upsert({
      where: { name: 'Campus Life' },
      update: {},
      create: {
        name: 'Campus Life',
        description: 'General campus experiences'
      }
    }),
    prisma.confessionCategory.upsert({
      where: { name: 'Personal' },
      update: {},
      create: {
        name: 'Personal',
        description: 'Personal thoughts and feelings'
      }
    }),
    prisma.confessionCategory.upsert({
      where: { name: 'Anonymous Tips' },
      update: {},
      create: {
        name: 'Anonymous Tips',
        description: 'Anonymous suggestions and tips'
      }
    })
  ]);

  // Seed marketplace categories
  const marketplaceCategories = await Promise.all([
    prisma.marketplaceCategory.upsert({
      where: { name: 'Textbooks' },
      update: {},
      create: {
        name: 'Textbooks',
        description: 'Academic books and study materials'
      }
    }),
    prisma.marketplaceCategory.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Laptops, phones, and gadgets'
      }
    }),
    prisma.marketplaceCategory.upsert({
      where: { name: 'Furniture' },
      update: {},
      create: {
        name: 'Furniture',
        description: 'Dorm and apartment furniture'
      }
    }),
    prisma.marketplaceCategory.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: {
        name: 'Clothing',
        description: 'Clothes and accessories'
      }
    }),
    prisma.marketplaceCategory.upsert({
      where: { name: 'Sports & Recreation' },
      update: {},
      create: {
        name: 'Sports & Recreation',
        description: 'Sports equipment and gear'
      }
    }),
    prisma.marketplaceCategory.upsert({
      where: { name: 'Other' },
      update: {},
      create: {
        name: 'Other',
        description: 'Miscellaneous items'
      }
    })
  ]);

  console.log('✅ Database seeding completed!');
  console.log(`📝 Created ${confessionCategories.length} confession categories`);
  console.log(`🛒 Created ${marketplaceCategories.length} marketplace categories`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
