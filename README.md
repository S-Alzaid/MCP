# MCP Server for ElevenLabs

A Model Context Protocol (MCP) server specifically designed for ElevenLabs conversational agents, providing tools for agents to interact with external services and perform various tasks.

## Features

This MCP server provides the following tools:

- **search_web**: Search the web for information
- **get_weather**: Get current weather information for a location
- **calculate**: Perform mathematical calculations

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## ElevenLabs Integration

This server is specifically designed for ElevenLabs conversational agents. For detailed setup instructions, see [ELEVENLABS-INTEGRATION.md](./ELEVENLABS-INTEGRATION.md).

### Quick Start for ElevenLabs:
```bash
npm run dev:elevenlabs
```

Then add `http://localhost:3000/mcp` to your ElevenLabs agent's MCP server configuration.

## Usage

### Development Mode

Run the server in development mode with hot reloading:
```bash
npm run dev
```

### Production Mode

Build and run the server:
```bash
npm run build
npm start
```

## Configuration

The server can be configured by modifying the following:

- **Server name and version**: Edit `src/index.ts`
- **Tool implementations**: Edit `src/tools.ts`
- **Tool schemas**: Modify the Zod schemas in `src/tools.ts`

## Adding New Tools

To add a new tool:

1. Define the tool schema in `src/tools.ts`:
```typescript
export const NewToolSchema = z.object({
  parameter: z.string().describe("Description of the parameter"),
});
```

2. Implement the tool handler:
```typescript
export async function handleNewTool(args: z.infer<typeof NewToolSchema>) {
  // Your tool implementation here
  return {
    content: [
      {
        type: "text" as const,
        text: "Tool result",
      },
    ],
  };
}
```

3. Add the tool to the tools array:
```typescript
export const tools = [
  // ... existing tools
  {
    name: "new_tool",
    description: "Description of the new tool",
    inputSchema: NewToolSchema,
  },
];
```

4. Add the case in the switch statement in `src/index.ts`:
```typescript
case "new_tool":
  return await handleNewTool(args);
```

## MCP Client Configuration

To use this server with an MCP client, add the following configuration:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["path/to/your/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Development

### Project Structure

```
src/
├── index.ts      # Main server entry point
├── tools.ts      # Tool definitions and implementations
└── types.ts      # Type definitions (if needed)
```

### Scripts

- `npm run build`: Build the TypeScript code
- `npm run dev`: Run in development mode with hot reloading
- `npm start`: Run the built server
- `npm test`: Run tests (when implemented)

## Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
- `zod`: Schema validation and type safety
- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution for development

## License

MIT 