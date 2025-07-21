#!/usr/bin/env node

import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple tool implementations (no TypeScript compilation needed)
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

// MCP endpoints
app.post("/mcp", async (req, res) => {
  try {
    const { jsonrpc, id, method, params } = req.body;

    if (jsonrpc !== "2.0") {
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32600,
          message: "Invalid Request"
        }
      });
    }

    switch (method) {
      case "initialize":
        return res.json({
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

      case "tools/list":
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools
          }
        });

      case "tools/call":
        const { name, arguments: args } = params;
        
        if (!args) {
          return res.json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32602,
              message: "Invalid params: arguments are required"
            }
          });
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
          default:
            return res.json({
              jsonrpc: "2.0",
              id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`
              }
            });
        }

        return res.json({
          jsonrpc: "2.0",
          id,
          result
        });

      default:
        return res.json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        });
    }
  } catch (error) {
    console.error("Error handling MCP request:", error);
    return res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id,
      error: {
        code: -32603,
        message: "Internal error",
        data: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    server: "elevenlabs-mcp-server",
    version: "1.0.0",
    tools: tools.map(t => t.name)
  });
});

// Start server
app.listen(port, () => {
  console.error(`ElevenLabs MCP server started on port ${port}`);
  console.error(`Server URL: http://localhost:${port}/mcp`);
  console.error("Available tools:", tools.map(t => t.name).join(", "));
}); 