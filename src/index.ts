#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools, handleSearchWeb, handleGetWeather, handleCalculate } from "./tools.js";

// Create the MCP server
const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0",
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("Tool arguments are required");
  }

  switch (name) {
    case "search_web":
      return await handleSearchWeb(args as any);
    case "get_weather":
      return await handleGetWeather(args as any);
    case "calculate":
      return await handleCalculate(args as any);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server started");
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
}); 