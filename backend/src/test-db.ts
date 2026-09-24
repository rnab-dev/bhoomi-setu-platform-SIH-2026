import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing connection to Supabase PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');

    console.log('Testing basic query...');
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Basic query successful:', result);

    console.log('Testing PostGIS spatial query...');
    const postgisResult = await prisma.$queryRaw`SELECT postgis_version() as version`;
    console.log('✅ PostGIS query successful:', postgisResult);

  } catch (error) {
    console.error('❌ Connection or query failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
