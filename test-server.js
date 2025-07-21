#!/usr/bin/env node

// Simple test script to verify the MCP server
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing MCP server...');

// Start the server
const serverProcess = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Test data
const testRequests = [
  {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  },
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list"
  },
  {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "calculate",
      arguments: {
        expression: "2 + 2"
      }
    }
  }
];

let requestIndex = 0;

function sendNextRequest() {
  if (requestIndex < testRequests.length) {
    const request = testRequests[requestIndex];
    console.log(`\nSending request ${requestIndex + 1}:`, request.method);
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
    requestIndex++;
  } else {
    console.log('\nAll tests completed. Shutting down server...');
    serverProcess.kill();
  }
}

// Handle server responses
serverProcess.stdout.on('data', (data) => {
  const response = data.toString().trim();
  if (response) {
    try {
      const parsed = JSON.parse(response);
      console.log('Response:', JSON.stringify(parsed, null, 2));
      
      // Send next request after a short delay
      setTimeout(sendNextRequest, 100);
    } catch (error) {
      console.log('Raw response:', response);
    }
  }
});

// Handle server errors
serverProcess.stderr.on('data', (data) => {
  console.log('Server stderr:', data.toString());
});

// Handle server exit
serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Start sending requests
setTimeout(sendNextRequest, 500); 