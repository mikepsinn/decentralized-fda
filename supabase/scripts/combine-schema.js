const fs = require('fs').promises;
const path = require('path');

// Order of schemas to create - core schemas first
const SCHEMA_ORDER = [
    'global',    // Global types and enums MUST be first
    'core',      // Core functionality
    'oauth2',    // OAuth functionality
    'reference', // Reference data
    'personal',  // Personal data
    'cohort',    // Cohort management
    'models',    // Models and simulations
    'finance',   // Financial data
    'commerce',  // E-commerce
    'logistics', // Logistics
    'scheduling' // Scheduling
];

// Order of object types to create - moved alters to the end
const OBJECT_TYPES = [
    { suffix: '.type.sql', subdir: null },        // Types first
    { suffix: '.table.sql', subdir: null },       // Then tables
    { suffix: '.function.sql', subdir: null },    // Functions
    { suffix: '.view.sql', subdir: null },        // Views
    { suffix: '.trigger.sql', subdir: 'triggers' },// Triggers
    { suffix: '.seed.sql', subdir: 'seeds' },     // Seed data
    { suffix: '.alter.sql', subdir: 'alters' },   // Alter statements last
    { suffix: '.policy.sql', subdir: 'policies' } // Policies after alters
];

function extractTableInfo(sql) {
    // Extract table name
    const tableMatch = sql.match(/CREATE\s+TABLE\s+(?:(\w+)\.)?(\w+)/i);
    if (!tableMatch) return null;
    
    const [_, schemaName, tableName] = tableMatch;
    
    // Find all REFERENCES
    const dependencies = new Set();
    const selfRefs = new Set();
    const refMatches = sql.matchAll(/REFERENCES\s+(?:(\w+)\.)?(\w+)/gi);
    
    for (const match of refMatches) {
        const [__, refSchema, refTable] = match;
        const fullRef = `${refSchema || schemaName}.${refTable}`;
        
        // Check if this is a self-reference
        if (refTable === tableName && (!refSchema || refSchema === schemaName)) {
            selfRefs.add(fullRef);
        } else {
            dependencies.add(fullRef);
        }
    }
    
    // If table has self-references, modify the SQL to make those FKs DEFERRABLE
    let modifiedSql = sql;
    if (selfRefs.size > 0) {
        // Replace each self-referential REFERENCES clause with a DEFERRABLE version
        for (const selfRef of selfRefs) {
            const regex = new RegExp(`(REFERENCES\\s+${selfRef.replace('.', '\\.')})([,\\s)]|\\s+ON\\s+)`, 'gi');
            modifiedSql = modifiedSql.replace(regex, '$1 DEFERRABLE INITIALLY DEFERRED$2');
        }
    }
    
    return {
        name: `${schemaName || 'public'}.${tableName}`,
        schema: schemaName,
        sql: modifiedSql,
        dependencies: Array.from(dependencies)
    };
}

function extractSeedInfo(sql) {
    // Extract table name from INSERT INTO statement
    const tableMatch = sql.match(/INSERT\s+INTO\s+(?:(\w+)\.)?(\w+)/i);
    if (!tableMatch) return null;
    
    const [_, schemaName, tableName] = tableMatch;
    
    return {
        name: `${schemaName || 'public'}.${tableName}`,
        schema: schemaName,
        sql: sql,
        // The seed data depends on its corresponding table
        dependencies: [`${schemaName || 'public'}.${tableName}`]
    };
}

function sortTablesByDependencies(tables) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();
    
    function visit(table) {
        if (visiting.has(table.name)) {
            console.warn(`Warning: Circular dependency detected for table ${table.name}, will be handled with DEFERRABLE constraints`);
            return;
        }
        if (visited.has(table.name)) return;
        
        visiting.add(table.name);
        
        for (const dep of table.dependencies) {
            const depTable = tables.find(t => t.name === dep);
            if (depTable) {
                visit(depTable);
            }
        }
        
        visiting.delete(table.name);
        visited.add(table.name);
        sorted.push(table);
    }
    
    // Process all tables
    for (const table of tables) {
        if (!visited.has(table.name)) {
            visit(table);
        }
    }
    
    return sorted;
}

// Helper function to properly format JSON arrays for SQL
function formatJsonArray(arr) {
    if (!arr) return 'NULL';
    // Ensure the array is properly formatted with double quotes
    const formattedArr = JSON.stringify(arr)
        .replace(/'/g, "''"); // Escape single quotes for SQL
    return `'${formattedArr}'`;
}

// Helper function to process SQL content
function processSqlContent(content) {
    // Replace JSON arrays in single quotes with properly formatted arrays
    return content.replace(/'(\[.*?\])'/g, (match, p1) => {
        try {
            const arr = JSON.parse(p1);
            return formatJsonArray(arr);
        } catch (e) {
            // If parsing fails, return the original match
            return match;
        }
    });
}

async function readSqlFiles(directory) {
    const files = [];
    const fullPath = path.join(__dirname, '..', directory);
    
    try {
        const items = await fs.readdir(fullPath, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(fullPath, item.name);
            
            if (item.isDirectory()) {
                const subFiles = await readSqlFiles(path.join(directory, item.name));
                files.push(...subFiles);
            } else if (item.name.endsWith('.sql')) {
                let content = await fs.readFile(itemPath, 'utf8');
                
                // Process the content to handle JSON arrays properly
                content = processSqlContent(content);

                if (item.name.endsWith('.seed.sql')) {
                    files.push({
                        path: itemPath,
                        content: content,
                        type: 'seed'
                    });
                } else {
                    files.push({
                        path: itemPath,
                        content: content,
                        type: 'migration'
                    });
                }
            }
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn(`Warning reading from ${directory}: ${error.message}`);
        }
    }

    return files;
}

async function createMigration() {
    const migrationParts = [];
    const seedParts = [];
    const allAlters = [];

    // Helper function to properly format JSON arrays for SQL
    function formatJsonArray(arr) {
        if (!arr) return 'NULL';
        // Ensure the array is properly formatted with double quotes
        const formattedArr = JSON.stringify(arr)
            .replace(/'/g, "''"); // Escape single quotes for SQL
        return `'${formattedArr}'`;
    }

    // Helper function to process SQL content
    function processSqlContent(content) {
        // Replace JSON arrays in single quotes with properly formatted arrays
        return content.replace(/'(\[.*?\])'/g, (match, p1) => {
            try {
                const arr = JSON.parse(p1);
                return formatJsonArray(arr);
            } catch (e) {
                // If parsing fails, return the original match
                return match;
            }
        });
    }

    async function readSqlFiles(directory) {
        const files = [];
        const fullPath = path.join(__dirname, '..', directory);
        
        try {
            const items = await fs.readdir(fullPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(fullPath, item.name);
                
                if (item.isDirectory()) {
                    const subFiles = await readSqlFiles(path.join(directory, item.name));
                    files.push(...subFiles);
                } else if (item.name.endsWith('.sql')) {
                    let content = await fs.readFile(itemPath, 'utf8');
                    
                    // Process the content to handle JSON arrays properly
                    content = processSqlContent(content);

                    if (item.name.endsWith('.seed.sql')) {
                        files.push({
                            path: itemPath,
                            content: content,
                            type: 'seed'
                        });
                    } else {
                        files.push({
                            path: itemPath,
                            content: content,
                            type: 'migration'
                        });
                    }
                }
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.warn(`Warning reading from ${directory}: ${error.message}`);
            }
        }

        return files;
    }

    for (const schema of SCHEMA_ORDER) {
        const schemaDir = path.join('schema', schema);
        const files = await readSqlFiles(schemaDir);
        
        // Separate migration and seed files
        const migrationFiles = files.filter(f => f.type === 'migration');
        const seedFiles = files.filter(f => f.type === 'seed');

        if (migrationFiles.length > 0) {
            migrationParts.push(`-- Schema: ${schema}`);
            migrationParts.push(migrationFiles.map(f => f.content).join('\n\n'));
            migrationParts.push('');
        }

        if (seedFiles.length > 0) {
            seedParts.push(`-- Seed data for ${schema}`);
            seedParts.push(seedFiles.map(f => f.content).join('\n\n'));
            seedParts.push('');
        }
    }

    // Write migration file
    const migrationContent = migrationParts.join('\n');
    await fs.writeFile(
        path.join(__dirname, '..', 'migrations', '00000000000000_initial_schema.sql'),
        migrationContent
    );
    console.log('Created migration file at', path.join(__dirname, '..', 'migrations', '00000000000000_initial_schema.sql'));

    // Write seed file
    const seedContent = seedParts.join('\n');
    await fs.writeFile(
        path.join(__dirname, '..', 'seed.sql'),
        seedContent
    );
    console.log('Created seed file at', path.join(__dirname, '..', 'seed.sql'));
}

createMigration()
    .then(() => console.log('Done!'))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    }); 