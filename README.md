# MCP Server for ElevenLabs

A Model Context Protocol (MCP) server specifically designed for ElevenLabs conversational agents, providing tools for agents to interact with external services and perform various tasks.

> **📋 Project Documentation**: This project has specific deployment requirements and structure decisions. See [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) before making any changes.

## Features

This MCP server provides the following tools:

- **search_web**: Search the web for information
- **get_weather**: Get current weather information for a location
- **calculate**: Perform mathematical calculations
- **create_sickleave**: Create a sick leave document for a patient

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

## ElevenLabs Integration

This server is specifically designed for ElevenLabs conversational agents. For detailed setup instructions, see [ELEVENLABS-INTEGRATION.md](./ELEVENLABS-INTEGRATION.md).

**⚠️ IMPORTANT**: Before making any changes to this project, read [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) for critical deployment requirements and lessons learned.

### Quick Start for ElevenLabs:
```bash
npm start
```

Then add `http://localhost:3000/mcp` to your ElevenLabs agent's MCP server configuration.

## Usage

### Development Mode

Run the server:
```bash
npm start
```

### Production Mode

Run the server:
```bash
npm start
```

## Configuration

The server can be configured by modifying the following:

- **Server name and version**: Edit `elevenlabs-true-streamable.js`
- **Tool implementations**: Edit `elevenlabs-true-streamable.js`
- **Tool schemas**: Modify the schemas in `elevenlabs-true-streamable.js`

> **Note**: This project uses a single-file approach for deployment reliability. All tools and schemas are hardcoded in the main server file.

## Adding New Tools

To add a new tool:

1. Define the tool schema in `elevenlabs-true-streamable.js`:
```javascript
{
  name: "new_tool",
  description: "Description of the new tool",
  inputSchema: {
    type: "object",
    properties: {
      parameter: { type: "string", description: "Description of the parameter" }
    },
    required: ["parameter"]
  }
}
```

2. Implement the tool handler in `elevenlabs-true-streamable.js`:
```javascript
async function handleNewTool(args) {
  // Your tool implementation here
  return {
    content: [
      {
        type: "text",
        text: "Tool result",
      },
    ],
  };
}
```

3. Add the tool to the tools array and the handler to the switch statement in `elevenlabs-true-streamable.js`

> **Note**: This project uses a single-file approach. All modifications should be made directly in `elevenlabs-true-streamable.js`.

```javascript
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