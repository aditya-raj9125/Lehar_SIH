const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database migrations completed successfully!');
    
    // Create initial admin user
    await createInitialUsers();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function createInitialUsers() {
  try {
    const bcrypt = require('bcryptjs');
    
    // Check if admin user already exists
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@lehar.gov.in']);
    
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await pool.query(`
        INSERT INTO users (email, password_hash, name, role, email_verified)
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin@lehar.gov.in', hashedPassword, 'System Administrator', 'official', true]);
      
      console.log('✅ Initial admin user created: admin@lehar.gov.in / admin123');
    }
    
    // Check if demo citizen exists
    const existingCitizen = await pool.query('SELECT id FROM users WHERE email = $1', ['citizen@demo.com']);
    
    if (existingCitizen.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('citizen123', 12);
      
      await pool.query(`
        INSERT INTO users (email, password_hash, name, role, email_verified)
        VALUES ($1, $2, $3, $4, $5)
      `, ['citizen@demo.com', hashedPassword, 'Demo Citizen', 'citizen', true]);
      
      console.log('✅ Demo citizen user created: citizen@demo.com / citizen123');
    }
    
  } catch (error) {
    console.error('❌ Error creating initial users:', error);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().then(() => {
    console.log('🎉 Database setup complete!');
    process.exit(0);
  });
}

module.exports = { runMigrations };
