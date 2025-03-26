import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const COMPONENTS_DIR = path.join(process.cwd(), 'components');
const APP_DIR = path.join(process.cwd(), 'app');

interface ComponentInfo {
  name: string;
  path: string;
  isUsed: boolean;
  usedIn: string[];
}

async function getAllFiles(pattern: string): Promise<string[]> {
  return glob(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.d.ts',
      '**/*.test.ts',
      '**/*.spec.ts'
    ]
  });
}

function extractComponentName(filePath: string): string {
  const basename = path.basename(filePath);
  return basename.replace(/\.(tsx|ts)$/, '');
}

async function findComponentUsage(): Promise<void> {
  try {
    // Get all component files
    const componentFiles = await getAllFiles('components/**/*.{ts,tsx}');
    const components: Map<string, ComponentInfo> = new Map();

    // Initialize component info
    componentFiles.forEach(file => {
      const name = extractComponentName(file);
      components.set(name, {
        name,
        path: file,
        isUsed: false,
        usedIn: []
      });
    });

    // Get all app files
    const appFiles = await getAllFiles('app/**/*.{ts,tsx}');

    // Check each app file for component usage
    for (const file of appFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Check for component imports and usage
      components.forEach((info, componentName) => {
        // Check different import patterns
        const importPatterns = [
          `import ${componentName}`,
          `import { ${componentName}`,
          `from '.+/${componentName}'`,
          `from "@/components/${componentName}"`,
          `from "@/components/.+/${componentName}"`,
        ];

        for (const pattern of importPatterns) {
          if (new RegExp(pattern).test(content)) {
            info.isUsed = true;
            info.usedIn.push(file);
            break;
          }
        }
      });
    }

    // Print results
    console.log('\nUnused Components Analysis:');
    console.log('==========================\n');

    const unusedComponents: ComponentInfo[] = [];
    const usedComponents: ComponentInfo[] = [];

    components.forEach(info => {
      if (!info.isUsed) {
        unusedComponents.push(info);
      } else {
        usedComponents.push(info);
      }
    });

    if (unusedComponents.length === 0) {
      console.log('All components are being used! 🎉\n');
    } else {
      console.log('Unused Components:');
      console.log('----------------\n');
      unusedComponents.forEach(info => {
        console.log(`- ${info.path}`);
      });
      console.log(`\nTotal unused components: ${unusedComponents.length}`);
    }

    console.log('\nUsed Components:');
    console.log('--------------\n');
    usedComponents.forEach(info => {
      console.log(`- ${info.path}`);
      console.log(`  Used in:`);
      info.usedIn.forEach(usage => {
        console.log(`    - ${usage}`);
      });
      console.log('');
    });

    // Generate deletion script
    if (unusedComponents.length > 0) {
      console.log('\nTo remove unused components, you can run:');
      console.log('----------------------------------------\n');
      unusedComponents.forEach(info => {
        console.log(`rm "${info.path}"`);
      });
    }

  } catch (error) {
    console.error('Error analyzing components:', error);
    process.exit(1);
  }
}

// Run the analysis
findComponentUsage(); 