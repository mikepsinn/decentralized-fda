/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const LIB_DIR = path.join(process.cwd(), 'lib');
const PROJECT_ROOT = process.cwd();
const EXCLUDED_PATTERNS = [
  '**/*.d.ts',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
];

async function getAllFiles(dir: string): Promise<string[]> {
  const files = await glob('**/*.{ts,tsx,js,jsx}', { 
    cwd: dir, 
    ignore: EXCLUDED_PATTERNS,
    absolute: false
  });
  return files;
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // Regular imports
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Dynamic imports
  const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Require statements
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Next.js specific imports (getStaticProps, getServerSideProps)
  const nextImportRegex = /(?:getStaticProps|getServerSideProps|getInitialProps).*?['"]([^'"]+)['"]/g;
  while ((match = nextImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

function resolveImportPath(importPath: string, fromFile: string): string[] {
  const resolvedPaths: string[] = [];

  if (importPath.startsWith('@/')) {
    // Handle @/ alias
    resolvedPaths.push(path.join(PROJECT_ROOT, importPath.slice(2)));
    
    // Also try without extension
    const withoutExt = path.join(PROJECT_ROOT, importPath.slice(2)).replace(/\.[^/.]+$/, '');
    resolvedPaths.push(withoutExt);
    
    // Try with different extensions
    ['.ts', '.tsx', '.js', '.jsx'].forEach(ext => {
      resolvedPaths.push(withoutExt + ext);
    });
  } else if (importPath.startsWith('.')) {
    // Relative imports
    const resolved = path.resolve(path.dirname(fromFile), importPath);
    resolvedPaths.push(resolved);
    
    // Also try without extension
    const withoutExt = resolved.replace(/\.[^/.]+$/, '');
    resolvedPaths.push(withoutExt);
    
    // Try with different extensions
    ['.ts', '.tsx', '.js', '.jsx'].forEach(ext => {
      resolvedPaths.push(withoutExt + ext);
    });
  }

  return resolvedPaths;
}

async function findUnusedFiles() {
  try {
    // Get all files in lib directory
    const libFiles = await getAllFiles(LIB_DIR);
    const libFileSet = new Set(libFiles.map(f => path.join(LIB_DIR, f)));

    // Get all project files
    const projectFiles = await getAllFiles(PROJECT_ROOT);
    const projectFileSet = new Set(projectFiles.map(f => path.join(PROJECT_ROOT, f)));

    // Track used files
    const usedFiles = new Set<string>();

    // Analyze each project file
    const projectFilesArray = Array.from(projectFileSet);
    for (const file of projectFilesArray) {
      const content = fs.readFileSync(file, 'utf-8');
      const imports = extractImports(content);

      for (const imp of imports) {
        const resolvedPaths = resolveImportPath(imp, file);
        for (const resolvedPath of resolvedPaths) {
          if (libFileSet.has(resolvedPath)) {
            usedFiles.add(resolvedPath);
          }
        }
      }
    }

    // Find unused files
    const unusedFiles = Array.from(libFileSet).filter(file => !usedFiles.has(file));

    // Print results
    console.log('\nUnused files in lib directory:');
    console.log('==============================\n');
    
    if (unusedFiles.length === 0) {
      console.log('No unused files found!');
      return;
    }

    unusedFiles.forEach(file => {
      const relativePath = path.relative(PROJECT_ROOT, file);
      console.log(`- ${relativePath}`);
    });

    console.log(`\nTotal unused files: ${unusedFiles.length}`);
    console.log('\nNote: This analysis includes:');
    console.log('- Regular imports (import from)');
    console.log('- Dynamic imports (import())');
    console.log('- Require statements');
    console.log('- Next.js data fetching imports');
    console.log('\nSome files might be used through other mechanisms not detected by this script.');

  } catch (error) {
    console.error('Error finding unused files:', error);
    process.exit(1);
  }
}

// Run the script
findUnusedFiles(); 