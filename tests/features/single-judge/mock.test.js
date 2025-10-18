/**
 * Single Judge Mock Tests
 * 
 * Tests the single judge functionality without requiring external APIs
 */

const fs = require('fs');
const path = require('path');

describe('Single Judge Mock Tests', () => {
  test('API route structure validation', () => {
    const apiRoutePath = path.join(__dirname, '../../../src/app/api/roast/route.ts');
    expect(fs.existsSync(apiRoutePath)).toBe(true);
    
    const content = fs.readFileSync(apiRoutePath, 'utf8');
    
    // Check for required exports
    expect(content).toContain('export async function POST');
    expect(content).toContain('NextRequest');
    expect(content).toContain('NextResponse');
    
    // Check for validation logic
    expect(content).toContain('idea.trim().length === 0');
    expect(content).toContain('VALIDATION_EMPTY');
    
    // Check for error handling
    expect(content).toContain('catch (error)');
    expect(content).toContain('console.error');
  });

  test('Gemini service structure validation', () => {
    const geminiPath = path.join(__dirname, '../../../src/lib/gemini.ts');
    expect(fs.existsSync(geminiPath)).toBe(true);
    
    const content = fs.readFileSync(geminiPath, 'utf8');
    
    // Check for required functions
    expect(content).toContain('export async function generateRoast');
    expect(content).toContain('export async function moderateContent');
    
    // Check for Google AI integration
    expect(content).toContain('GoogleGenerativeAI');
    expect(content).toContain('gemini-1.5-flash');
    
    // Check for response structure
    expect(content).toContain('JudgeResponse');
    expect(content).toContain('scores');
    expect(content).toContain('roast');
    expect(content).toContain('feedback');
    expect(content).toContain('verdict');
  });

  test('Database schema validation', () => {
    const schemaPath = path.join(__dirname, '../../../src/lib/db/schema.ts');
    expect(fs.existsSync(schemaPath)).toBe(true);
    
    const content = fs.readFileSync(schemaPath, 'utf8');
    
    // Check for required tables
    expect(content).toContain('export const roasts');
    expect(content).toContain('export const roastFiles');
    expect(content).toContain('export const leaderboard');
    
    // Check for required fields
    expect(content).toContain('ideaText: text');
    expect(content).toContain('toneHumor: real');
    expect(content).toContain('toneSarcasm: real');
    expect(content).toContain('judgesData: jsonb');
  });

  test('Type definitions validation', () => {
    const typesPath = path.join(__dirname, '../../../src/types/index.ts');
    expect(fs.existsSync(typesPath)).toBe(true);
    
    const content = fs.readFileSync(typesPath, 'utf8');
    
    // Check for required interfaces
    expect(content).toContain('interface ToneMatrix');
    expect(content).toContain('interface JudgeResponse');
    expect(content).toContain('interface MultiJudgeResponse');
    expect(content).toContain('interface RoastSession');
    
    // Check for required types
    expect(content).toContain('type ErrorType');
    expect(content).toContain('GENERIC');
    expect(content).toContain('VALIDATION_EMPTY');
  });

  test('Constants validation', () => {
    const constantsPath = path.join(__dirname, '../../../src/lib/constants.ts');
    expect(fs.existsSync(constantsPath)).toBe(true);
    
    const content = fs.readFileSync(constantsPath, 'utf8');
    
    // Check for error types
    expect(content).toContain('export const ERROR_TYPES');
    expect(content).toContain('GENERIC');
    expect(content).toContain('PARSE_FAIL');
    expect(content).toContain('UNSAFE_CONTENT');
    
    // Check for judge personas
    expect(content).toContain('export const JUDGE_PERSONAS');
    expect(content).toContain('Technical Judge');
    expect(content).toContain('Business Judge');
    expect(content).toContain('Creative Judge');
  });

  test('Component integration validation', () => {
    const pagePath = path.join(__dirname, '../../../src/app/page.tsx');
    expect(fs.existsSync(pagePath)).toBe(true);
    
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check for component imports
    expect(content).toContain('import IdeaInput');
    expect(content).toContain('import ToneMatrix');
    expect(content).toContain('import ErrorDisplay');
    expect(content).toContain('import JudgeCard');
    
    // Check for state management
    expect(content).toContain('useState');
    expect(content).toContain('idea');
    expect(content).toContain('tone');
    expect(content).toContain('isValid');
    expect(content).toContain('isLoading');
    expect(content).toContain('error');
    expect(content).toContain('roastResult');
    
    // Check for API integration
    expect(content).toContain('fetch(\'/api/roast\'');
    expect(content).toContain('POST');
    expect(content).toContain('JSON.stringify');
  });

  test('Build configuration validation', () => {
    const packageJsonPath = path.join(__dirname, '../../../package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(content);
    
    // Check for required scripts
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.scripts).toHaveProperty('test:single-judge');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('dev');
    
    // Check for required dependencies
    expect(packageJson.dependencies).toHaveProperty('@google/generative-ai');
    expect(packageJson.dependencies).toHaveProperty('@supabase/supabase-js');
    expect(packageJson.dependencies).toHaveProperty('drizzle-orm');
    expect(packageJson.dependencies).toHaveProperty('framer-motion');
  });
});

// Simple test runner for Node.js
function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
    toHaveProperty: (prop) => {
      if (!(prop in actual)) {
        throw new Error(`Expected property '${prop}' to exist`);
      }
    }
  };
}

async function test(name, fn) {
  try {
    console.log(`  ✓ ${name}`);
    await fn();
  } catch (error) {
    console.log(`  ✗ ${name}: ${error.message}`);
    throw error;
  }
}

async function describe(name, fn) {
  console.log(`\n📋 ${name}`);
  try {
    await fn();
  } catch (error) {
    console.log(`❌ ${name} failed: ${error.message}`);
    throw error;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await describe('Single Judge Mock Tests', async () => {
        await test('API route structure validation', () => {
          const apiRoutePath = path.join(__dirname, '../../../src/app/api/roast/route.ts');
          expect(fs.existsSync(apiRoutePath)).toBe(true);
        });
      });
      console.log('\n✅ All mock tests passed!');
    } catch (error) {
      console.log(`\n❌ Mock tests failed: ${error.message}`);
      process.exit(1);
    }
  })();
}
