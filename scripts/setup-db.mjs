import pg from 'pg';

async function setup() {
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  };

  console.log('Connecting to PostgreSQL...');
  
  const pool = new pg.Pool(config);
  
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL!');
    
    await client.query("ALTER USER postgres WITH PASSWORD 'postgres'");
    console.log('Password set for postgres');
    
    await client.query('CREATE DATABASE flyspec');
    console.log('Database flyspec created');
    
    client.release();
    await pool.end();
    
  } catch (e) {
    console.log('Error:', e.message);
    
    if (e.code === '42P04') {
      console.log('Database flyspec already exists');
      
      const pool2 = new pg.Pool({...config, database: 'flyspec'});
      const testClient = await pool2.connect();
      console.log('flyspec database is accessible!');
      testClient.release();
      await pool2.end();
    }
  }
}

setup();
