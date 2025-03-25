import { createClient } from '@vercel/postgres';
import * as fs from 'fs/promises';
import * as path from 'path';

// Ensure we have the database URL
if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is required');
  process.exit(1);
}

const db = createClient({
  connectionString: process.env.POSTGRES_URL
});

const TABLES = [
  'datasources',
  'equations',
  'interventions',
  'parameters',
  'primary_outcomes',
  'secondary_outcomes',
  'equation_datasources',
  'parameter_datasources',
  'parameter_equations',
  'primary_outcome_datasources',
  'primary_outcome_equations',
  'secondary_outcome_datasources'
];

// Allow backup directory to be configured via env var
const BACKUP_DIR = process.env.DB_BACKUP_DIR 
  ? path.resolve(process.env.DB_BACKUP_DIR)
  : path.join(process.cwd(), 'db-backup');

async function backupTable(tableName: string) {
  console.log(`Backing up ${tableName}...`);
  
  const result = await db.query(`SELECT * FROM ${tableName}`);
  const data = result.rows;
  
  // Create backup directory if it doesn't exist
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  
  // Write to JSON file
  const filePath = path.join(BACKUP_DIR, `${tableName}.json`);
  await fs.writeFile(
    filePath, 
    JSON.stringify(data, null, 2),
    'utf-8'
  );
  
  console.log(`✅ Backed up ${data.length} rows from ${tableName}`);
  return data.length;
}

async function main() {
  console.log('Starting database backup...');
  
  try {
    await db.connect();
    
    // Backup all tables
    const results = await Promise.all(
      TABLES.map(backupTable)
    );
    
    // Create a summary file
    const summary = TABLES.reduce((acc, table, i) => {
      acc[table] = results[i];
      return acc;
    }, {} as Record<string, number>);
    
    await fs.writeFile(
      path.join(BACKUP_DIR, '_summary.json'),
      JSON.stringify(summary, null, 2),
      'utf-8'
    );
    
    console.log('\nBackup completed! Summary:');
    console.table(summary);
    
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main(); 