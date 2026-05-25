const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

async function run() {
  const connectionString = 'postgresql://postgres.dvvpohjugeiufqwlmxzg:IKn1NkFeieNBuKdG@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';
  
  console.log(`Testing query on: ${connectionString.replace(/:[^:@]+@/, ':***@')}`);
  const pool = new pg.Pool({ connectionString });
  const pgAdapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter: pgAdapter });
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('🎉 CONNECTION AND AUTHENTICATION SUCCESS!', result);
  } catch (err) {
    console.log('❌ QUERY FAILED:', err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

run();
