const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database migration...')
  
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Push the schema to create tables
    const { execSync } = require('child_process')
    execSync('npx prisma db push', { stdio: 'inherit' })
    console.log('✅ Database schema pushed successfully')
    
    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'admin@bigdentist.com' },
      update: {},
      create: {
        email: 'admin@bigdentist.com',
        firstName: 'Admin',
        lastName: 'User',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iKGi', // Dr.hossam@123
        role: 'ADMIN',
      },
    })
    
    console.log('✅ Test user created:', testUser.email)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('🎉 Database migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }) 