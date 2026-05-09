const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          license_key VARCHAR(255),
          license_expires_at TIMESTAMP WITH TIME ZONE,
          module_progress JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
      );

      CREATE TABLE IF NOT EXISTS license_keys (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          key VARCHAR(255) UNIQUE NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          validity_days INTEGER DEFAULT 90,
          used_by UUID REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cv_data (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          cv_name VARCHAR(255) DEFAULT 'Draft CV',
          target_position VARCHAR(255),
          summary TEXT,
          personal_info JSONB DEFAULT '{}'::jsonb,
          experiences JSONB DEFAULT '[]'::jsonb,
          education JSONB DEFAULT '[]'::jsonb,
          skills JSONB DEFAULT '[]'::jsonb,
          certifications JSONB DEFAULT '[]'::jsonb,
          languages JSONB DEFAULT '[]'::jsonb,
          ai_analysis JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_cv_data_user_id ON cv_data(user_id);
    `);
    console.log('Database schema initialized.');
  } catch (error) {
    console.error('Failed to initialize schema', error);
  } finally {
    client.release();
  }
}

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
