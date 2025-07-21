#!/usr/bin/env node

import express, { Request, Response } from "express";
import cors from "cors";
import { tools, handleSearchWeb, handleGetWeather, handleCalculate } from "./tools.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ElevenLabs MCP Server endpoints
app.post("/mcp", async (req: Request, res: Response) => {
  try {
    const { jsonrpc, id, method, params } = req.body;

    if (jsonrpc !== "2.0") {
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32600,
          message: "Invalid Request",
        },
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
              tools: {},
            },
            serverInfo: {
              name: "elevenlabs-mcp-server",
              version: "1.0.0",
            },
          },
        });

      case "tools/list":
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools,
          },
        });

      case "tools/call":
        const { name, arguments: args } = params;
        
        if (!args) {
          return res.json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32602,
              message: "Invalid params: arguments are required",
            },
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
                message: `Unknown tool: ${name}`,
              },
            });
        }

        return res.json({
          jsonrpc: "2.0",
          id,
          result,
        });

      default:
        return res.json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
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
        data: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    server: "elevenlabs-mcp-server",
    version: "1.0.0",
    tools: tools.map(t => t.name),
  });
});

// Start the server
app.listen(port, () => {
  console.error(`ElevenLabs MCP server started on port ${port}`);
  console.error(`Server URL: http://localhost:${port}`);
  console.error("Add this URL to your ElevenLabs MCP server configuration");
  console.error("Available tools:", tools.map(t => t.name).join(", "));
}); 