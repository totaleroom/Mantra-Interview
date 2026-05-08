const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ 
  connectionString: 'postgresql://neondb_owner:npg_a5MCdvIxApB6@ep-shiny-shape-aowd7k9i.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' 
});

async function run() { 
  await pool.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT \'user\''); 
  
  const hash = await bcrypt.hash('admin123', 10); 
  const res = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id', ['admin@mantraskill.web.id', hash]); 
  
  let userId; 
  if (res.rows.length > 0) { 
    userId = res.rows[0].id; 
  } else { 
    const ex = await pool.query('SELECT id FROM users WHERE email=$1', ['admin@mantraskill.web.id']); 
    userId = ex.rows[0].id; 
  } 
  
  await pool.query('INSERT INTO profiles (user_id, full_name, role, module_progress) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET role=$3, module_progress=$4', [userId, 'Super Admin', 'admin', '{"1":true,"2":true,"3":true,"4":true,"5":true}']); 
  
  console.log('Admin created!'); 
  process.exit(0); 
} 

run().catch(console.error);
