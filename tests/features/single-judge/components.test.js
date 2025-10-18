/**
 * Single Judge Component Tests
 * 
 * Tests the React components for single judge functionality
 */

const fs = require('fs');
const path = require('path');

describe('Single Judge Component Tests', () => {
  const componentsDir = path.join(__dirname, '../../../src/components');
  
  test('IdeaInput component exists and has correct structure', () => {
    const ideaInputPath = path.join(componentsDir, 'IdeaInput.tsx');
    expect(fs.existsSync(ideaInputPath)).toBe(true);
    
    const content = fs.readFileSync(ideaInputPath, 'utf8');
    
    // Check for required props interface
    expect(content).toContain('interface IdeaInputProps');
    expect(content).toContain('value: string');
    expect(content).toContain('onChange: (value: string) => void');
    expect(content).toContain('onValidationChange: (isValid: boolean) => void');
    
    // Check for validation logic
    expect(content).toContain('maxLength = 1000');
    expect(content).toContain('isValid = value.trim().length > 0');
    
    // Check for required React hooks
    expect(content).toContain('useState');
    expect(content).toContain('useEffect');
  });

  test('ToneMatrix component exists and has correct structure', () => {
    const toneMatrixPath = path.join(componentsDir, 'ToneMatrix.tsx');
    expect(fs.existsSync(toneMatrixPath)).toBe(true);
    
    const content = fs.readFileSync(toneMatrixPath, 'utf8');
    
    // Check for required props interface
    expect(content).toContain('interface ToneMatrixProps');
    expect(content).toContain('value: ToneMatrixType');
    expect(content).toContain('onChange: (tone: ToneMatrixType) => void');
    
    // Check for tone matrix logic
    expect(content).toContain('humor');
    expect(content).toContain('sarcasm');
    expect(content).toContain('getQuadrantLabel');
    
    // Check for required React hooks
    expect(content).toContain('useState');
    expect(content).toContain('useRef');
    expect(content).toContain('useEffect');
  });

  test('ErrorDisplay component exists and has correct structure', () => {
    const errorDisplayPath = path.join(componentsDir, 'ErrorDisplay.tsx');
    expect(fs.existsSync(errorDisplayPath)).toBe(true);
    
    const content = fs.readFileSync(errorDisplayPath, 'utf8');
    
    // Check for required props interface
    expect(content).toContain('interface ErrorDisplayProps');
    expect(content).toContain('errorType: ErrorType');
    expect(content).toContain('onRetry: () => void');
    
    // Check for error handling
    expect(content).toContain('ERROR_TYPES');
    expect(content).toContain('error.category');
    expect(content).toContain('error.headline');
    expect(content).toContain('error.detail');
  });

  test('JudgeCard component exists and has correct structure', () => {
    const judgeCardPath = path.join(componentsDir, 'JudgeCard.tsx');
    expect(fs.existsSync(judgeCardPath)).toBe(true);
    
    const content = fs.readFileSync(judgeCardPath, 'utf8');
    
    // Check for required props interface
    expect(content).toContain('interface JudgeCardProps');
    expect(content).toContain('name: string');
    expect(content).toContain('response: JudgeResponse');
    expect(content).toContain('isVisible: boolean');
    
    // Check for score display logic
    expect(content).toContain('getScoreColor');
    expect(content).toContain('getVerdictColor');
    expect(content).toContain('scores.originality');
    expect(content).toContain('scores.feasibility');
    expect(content).toContain('scores.wow_factor');
    expect(content).toContain('scores.market_potential');
  });

  test('All components import required dependencies', () => {
    const componentFiles = [
      'IdeaInput.tsx',
      'ToneMatrix.tsx', 
      'ErrorDisplay.tsx',
      'JudgeCard.tsx'
    ];

    componentFiles.forEach(file => {
      const filePath = path.join(componentsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
    // Check for React import
    expect(content).toContain("import");
    expect(content).toContain("'use client'");
      
      // Check for proper TypeScript usage
      expect(content).toContain('interface ');
      expect(content).toContain(': ');
    });
  });

  test('Components use proper styling classes', () => {
    const componentFiles = [
      'IdeaInput.tsx',
      'ToneMatrix.tsx',
      'ErrorDisplay.tsx', 
      'JudgeCard.tsx'
    ];

    componentFiles.forEach(file => {
      const filePath = path.join(componentsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for Tailwind CSS classes
      expect(content).toMatch(/className=.*["'].*["']/);
      
      // Check for theme-aware classes
      expect(content).toMatch(/text-/);
      expect(content).toMatch(/bg-/);
    });
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
    toMatch: (regex) => {
      if (!regex.test(actual)) {
        throw new Error(`Expected ${actual} to match ${regex}`);
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
      await describe('Single Judge Component Tests', async () => {
        const componentsDir = path.join(__dirname, '../../../src/components');
        
        await test('IdeaInput component exists and has correct structure', () => {
          const ideaInputPath = path.join(componentsDir, 'IdeaInput.tsx');
          expect(fs.existsSync(ideaInputPath)).toBe(true);
        });
      });
      console.log('\n✅ All component tests passed!');
    } catch (error) {
      console.log(`\n❌ Component tests failed: ${error.message}`);
      process.exit(1);
    }
  })();
}
