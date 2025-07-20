const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Checking local database users...')
    
    // Connect to database
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log(`\n📊 Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`)
    })
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@bigdentist.com' }
    })
    
    if (adminUser) {
      console.log('\n✅ Admin user exists: admin@bigdentist.com')
    } else {
      console.log('\n❌ Admin user does not exist')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 