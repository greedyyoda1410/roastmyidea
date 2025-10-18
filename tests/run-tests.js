#!/usr/bin/env node

/**
 * Test Runner for RoastMyIdea.AI
 * 
 * Usage:
 *   node tests/run-tests.js [feature] [--port PORT] [--verbose]
 * 
 * Examples:
 *   node tests/run-tests.js single-judge
 *   node tests/run-tests.js multi-judge --port 3001
 *   node tests/run-tests.js integration --verbose
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const testConfig = require('./test-config');

class TestRunner {
  constructor() {
    this.args = process.argv.slice(2);
    this.feature = this.args[0] || 'single-judge';
    this.port = this.getPort();
    this.verbose = this.args.includes('--verbose');
    this.config = testConfig.features[this.feature] || testConfig.integration;
  }

  getPort() {
    const portArg = this.args.find(arg => arg.startsWith('--port='));
    return portArg ? parseInt(portArg.split('=')[1]) : this.config.port;
  }

  async run() {
    console.log(`🧪 Running tests for: ${this.feature}`);
    console.log(`📋 Description: ${this.config.description}`);
    console.log(`🌐 Port: ${this.port}`);
    console.log(`📁 Branch: ${this.config.branch}`);
    console.log('─'.repeat(50));

    try {
      // Check if we're on the correct branch
      await this.checkBranch();
      
      // Set up environment
      await this.setupEnvironment();
      
      // Start development server
      const serverProcess = await this.startServer();
      
      // Wait for server to be ready
      await this.waitForServer();
      
      // Run tests
      await this.runTestSuite();
      
      // Cleanup
      await this.cleanup(serverProcess);
      
      console.log('✅ All tests completed successfully!');
    } catch (error) {
      console.error('❌ Test run failed:', error.message);
      process.exit(1);
    }
  }

  async checkBranch() {
    return new Promise((resolve, reject) => {
      exec('git branch --show-current', (error, stdout) => {
        if (error) {
          reject(new Error(`Failed to check git branch: ${error.message}`));
          return;
        }
        
        const currentBranch = stdout.trim();
        if (currentBranch !== this.config.branch) {
          console.log(`⚠️  Warning: Currently on branch '${currentBranch}', expected '${this.config.branch}'`);
          console.log(`   Run: git checkout ${this.config.branch}`);
        }
        resolve();
      });
    });
  }

  async setupEnvironment() {
    console.log('🔧 Setting up environment...');
    
    // Create .env.test file with feature-specific environment variables
    const envContent = Object.entries(this.config.environment)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync('.env.test', envContent);
    console.log('✅ Environment variables set');
  }

  async startServer() {
    console.log('🚀 Starting development server...');
    
    return new Promise((resolve, reject) => {
      const server = spawn('npm', ['run', 'dev', '--', '--port', this.port.toString()], {
        stdio: this.verbose ? 'inherit' : 'pipe',
        env: { ...process.env, ...this.config.environment }
      });

      server.on('error', (error) => {
        reject(new Error(`Failed to start server: ${error.message}`));
      });

      // Give server time to start
      setTimeout(() => {
        console.log('✅ Server started');
        resolve(server);
      }, 3000);
    });
  }

  async waitForServer() {
    console.log('⏳ Waiting for server to be ready...');
    
    const maxAttempts = 30;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`http://localhost:${this.port}`);
        if (response.ok) {
          console.log('✅ Server is ready');
          return;
        }
      } catch (error) {
        // Server not ready yet
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Server failed to start within timeout');
  }

  async runTestSuite() {
    console.log('🧪 Running test suite...');
    
    for (const testFile of this.config.testFiles) {
      if (fs.existsSync(testFile)) {
        console.log(`📝 Running: ${testFile}`);
        await this.runTestFile(testFile);
      } else {
        console.log(`⚠️  Test file not found: ${testFile}`);
      }
    }
  }

  async runTestFile(testFile) {
    return new Promise((resolve, reject) => {
      const test = spawn('node', [testFile], {
        stdio: 'inherit',
        env: { ...process.env, ...this.config.environment, TEST_PORT: this.port }
      });

      test.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${testFile} passed`);
          resolve();
        } else {
          reject(new Error(`${testFile} failed with code ${code}`));
        }
      });
    });
  }

  async cleanup(serverProcess) {
    console.log('🧹 Cleaning up...');
    
    if (serverProcess) {
      serverProcess.kill();
    }
    
    // Remove test environment file
    if (fs.existsSync('.env.test')) {
      fs.unlinkSync('.env.test');
    }
    
    console.log('✅ Cleanup completed');
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Run the test runner
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(console.error);
}

module.exports = TestRunner;
