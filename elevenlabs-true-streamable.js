#!/usr/bin/env node

import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json());

// Add preflight handler for CORS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.sendStatus(200);
});

// Tool definitions
const tools = [
  {
    name: "search_web",
    description: "Search the web for information",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query to execute" },
        maxResults: { type: "number", description: "Maximum number of results to return" }
      },
      required: ["query"]
    }
  },
  {
    name: "get_weather",
    description: "Get current weather information for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string", description: "The location to get weather for" },
        units: { type: "string", enum: ["celsius", "fahrenheit"], description: "Temperature units" }
      },
      required: ["location"]
    }
  },
  {
    name: "calculate",
    description: "Perform mathematical calculations",
    inputSchema: {
      type: "object",
      properties: {
        expression: { type: "string", description: "Mathematical expression to evaluate" }
      },
      required: ["expression"]
    }
  },
  {
    name: "create_sickleave",
    description: "Create a sick leave document for a patient",
    inputSchema: {
      type: "object",
      properties: {
        patient_id: { type: "string", description: "Patient ID" },
        patient_dob: { type: "string", description: "Patient date of birth" },
        practitioner_license: { type: "string", description: "Practitioner license number" },
        admission_date: { type: "string", description: "Admission date" },
        discharge_date: { type: "string", description: "Discharge date" }
      },
      required: ["patient_id", "patient_dob", "practitioner_license", "admission_date", "discharge_date"]
    }
  }
];

// Tool handlers
async function handleSearchWeb(args) {
  const { query, maxResults = 5 } = args;
  console.log(`Searching for: ${query} (max results: ${maxResults})`);
  
  return {
    content: [
      {
        type: "text",
        text: `Search results for "${query}":\n\n1. Example result 1\n2. Example result 2\n3. Example result 3`
      }
    ]
  };
}

async function handleGetWeather(args) {
  const { location, units = "celsius" } = args;
  console.log(`Getting weather for: ${location} (units: ${units})`);
  
  return {
    content: [
      {
        type: "text",
        text: `Weather for ${location}:\nTemperature: 22°${units === "celsius" ? "C" : "F"}\nCondition: Sunny\nHumidity: 65%`
      }
    ]
  };
}

async function handleCalculate(args) {
  const { expression } = args;
  
  try {
    const result = eval(expression);
    return {
      content: [
        {
          type: "text",
          text: `${expression} = ${result}`
        }
      ]
    };
  } catch (error) {
    throw new Error(`Invalid mathematical expression: ${expression}`);
  }
}

async function handleCreateSickLeave(args) {
  const { patient_id, patient_dob, practitioner_license, admission_date, discharge_date } = args;
  
  console.log(`Creating sick leave for patient: ${patient_id}`);
  
  try {
    // Real API call to the protected endpoint
    const apiUrl = 'https://wth.devclan.io/function/create-sickleave';
    
    const requestData = {
      patient_id,
      patient_dob,
      practitioner_license,
      admission_date,
      discharge_date
    };
    
    console.log(`Making API call to: ${apiUrl}`);
    console.log(`Request data:`, requestData);
    
    // Make the actual API call using Node.js built-in https module
    const https = require('https');
    const url = require('url');
    
    const postData = JSON.stringify(requestData);
    const parsedUrl = url.parse(apiUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'MCP-Server/1.0'
      },
      timeout: 30000 // 30 second timeout
    };
    
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log(`API Response Status: ${res.statusCode}`);
        console.log(`API Response Headers:`, res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`API Response Body:`, data);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Success response
            try {
              const responseData = JSON.parse(data);
              resolve({
                content: [
                  {
                    type: "text",
                    text: `Sick leave document created successfully!\n\nPatient ID: ${patient_id}\nDate of Birth: ${patient_dob}\nPractitioner License: ${practitioner_license}\nAdmission Date: ${admission_date}\nDischarge Date: ${discharge_date}\n\nAPI Response: ${JSON.stringify(responseData, null, 2)}`
                  }
                ]
              });
            } catch (parseError) {
              resolve({
                content: [
                  {
                    type: "text",
                    text: `Sick leave document created successfully!\n\nPatient ID: ${patient_id}\nDate of Birth: ${patient_dob}\nPractitioner License: ${practitioner_license}\nAdmission Date: ${admission_date}\nDischarge Date: ${discharge_date}\n\nRaw API Response: ${data}`
                  }
                ]
              });
            }
          } else if (res.statusCode === 403) {
            // Geographic restriction or access denied
            reject(new Error(`Access denied (${res.statusCode}): This server's location is blocked by the API. Geographic restrictions are active.`));
          } else {
            // Other error
            reject(new Error(`API call failed with status ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('API request error:', error);
        reject(new Error(`Network error: ${error.message}`));
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('API request timed out after 30 seconds'));
      });
      
      // Send the request
      req.write(postData);
      req.end();
    });
    
  } catch (error) {
    console.error('Error in handleCreateSickLeave:', error);
    throw new Error(`Failed to create sick leave: ${error.message}`);
  }
}

// True Streamable HTTP MCP endpoint
app.post("/mcp", async (req, res) => {
  try {
    const { jsonrpc, id, method, params } = req.body;

    console.log(`MCP Request: ${method}`, { id, params });
    console.log(`Request Headers:`, req.headers);
    console.log(`Request Origin:`, req.get('origin'));
    console.log(`Request User-Agent:`, req.get('user-agent'));

    // Set headers for streaming
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (jsonrpc !== "2.0") {
      const errorResponse = JSON.stringify({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32600,
          message: "Invalid Request"
        }
      });
      
      res.write(errorResponse);
      res.end();
      return;
    }

    switch (method) {
      case "initialize":
        console.log("Initializing MCP connection");
        const initResponse = JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: "elevenlabs-mcp-server",
              version: "1.0.0"
            }
          }
        });
        
        res.write(initResponse);
        res.end();
        break;

      case "tools/list":
        console.log("Listing tools:", tools.map(t => t.name));
        const toolsResponse = JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            tools
          }
        });
        
        res.write(toolsResponse);
        res.end();
        break;

      case "tools/call":
        const { name, arguments: args } = params;
        console.log(`Calling tool: ${name}`, args);
        
        if (!args) {
          const errorResponse = JSON.stringify({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32602,
              message: "Invalid params: arguments are required"
            }
          });
          
          res.write(errorResponse);
          res.end();
          return;
        }

        let result;
        switch (name) {
          case "search_web":
            result = await handleSearchWeb(args);
            break;
          case "get_weather":
            result = await handleGetWeather(args);
            break;
          case "calculate":
            result = await handleCalculate(args);
            break;
          case "create_sickleave":
            result = await handleCreateSickLeave(args);
            break;
          default:
            const errorResponse = JSON.stringify({
              jsonrpc: "2.0",
              id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`
              }
            });
            
            res.write(errorResponse);
            res.end();
            return;
        }

        console.log(`Tool ${name} result:`, result);
        const callResponse = JSON.stringify({
          jsonrpc: "2.0",
          id,
          result
        });
        
        res.write(callResponse);
        res.end();
        break;

      default:
        console.log(`Unknown method: ${method}`);
        const errorResponse = JSON.stringify({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
            data: {
              availableMethods: ["initialize", "tools/list", "tools/call"],
              serverInfo: "ElevenLabs MCP Server"
            }
          }
        });
        
        res.write(errorResponse);
        res.end();
        break;
    }
  } catch (error) {
    console.error("Error handling MCP request:", error);
    const errorResponse = JSON.stringify({
      jsonrpc: "2.0",
      id: req.body.id,
      error: {
        code: -32603,
        message: "Internal error",
        data: error instanceof Error ? error.message : "Unknown error"
      }
    });
    
    res.write(errorResponse);
    res.end();
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    status: "healthy",
    server: "elevenlabs-mcp-server",
    version: "1.0.0",
    tools: tools.map(t => t.name),
    transport: "true-streamable-http",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ElevenLabs MCP Server (True Streamable HTTP)",
    version: "1.0.0",
    endpoints: {
      mcp: "/mcp",
      health: "/health"
    },
    tools: tools.map(t => t.name),
    transport: "Streamable HTTP with chunked responses"
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.error(`🚀 ElevenLabs MCP Server (True Streamable HTTP) started on port ${port}`);
  console.error(`📡 Server URL: http://0.0.0.0:${port}/mcp`);
  console.error(`🛠️  Available tools: ${tools.map(t => t.name).join(", ")}`);
  console.error(`🔧 Transport: True Streamable HTTP with chunked responses`);
  console.error(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.error(`🔗 Railway URL: ${process.env.RAILWAY_STATIC_URL || 'Not set'}`);
}); 