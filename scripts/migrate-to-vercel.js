const { PrismaClient } = require('@prisma/client')

// Local SQLite database
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
})

// Vercel PostgreSQL database (will use environment variables)
const vercelPrisma = new PrismaClient()

async function main() {
  try {
    console.log('🔄 Starting migration from local SQLite to Vercel PostgreSQL...')
    
    // Connect to local database
    await localPrisma.$connect()
    console.log('✅ Connected to local SQLite database')
    
    // Get all users from local database
    const localUsers = await localPrisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        password: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        department: true,
        supervisor: true,
        permissions: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    console.log(`📊 Found ${localUsers.length} users in local database`)
    
    // Connect to Vercel database
    await vercelPrisma.$connect()
    console.log('✅ Connected to Vercel PostgreSQL database')
    
    // Migrate each user
    for (const user of localUsers) {
      try {
        // Check if user already exists in Vercel database
        const existingUser = await vercelPrisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existingUser) {
          console.log(`⚠️  User ${user.email} already exists in Vercel database, skipping...`)
          continue
        }
        
        // Create user in Vercel database
        const newUser = await vercelPrisma.user.create({
          data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            country: user.country,
            password: user.password,
            role: user.role,
            avatar: user.avatar,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            department: user.department,
            supervisor: user.supervisor,
            permissions: user.permissions ? user.permissions.split(',').filter(p => p.trim()) : [],
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        })
        
        console.log(`✅ Migrated user: ${user.email} (${user.firstName} ${user.lastName})`)
        
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error.message)
      }
    }
    
    console.log('\n🎉 Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration error:', error)
  } finally {
    await localPrisma.$disconnect()
    await vercelPrisma.$disconnect()
  }
}

main() 