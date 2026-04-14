const pg = require('pg');
const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    await client.query("ALTER USER postgres WITH PASSWORD 'postgres';");
    console.log('Password set for postgres user');
    
    await client.query('CREATE DATABASE flyspec;');
    console.log('Database flyspec created');
    
  } catch (e) {
    if (e.code === '42P04') {
      console.log('Database flyspec already exists');
    } else {
      console.log('Error:', e.message);
    }
  } finally {
    await client.end();
  }
}

setup();
