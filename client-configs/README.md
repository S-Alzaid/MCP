# MCP Client Configuration Examples

This directory contains configuration examples for different MCP clients to connect to your custom MCP server.

## Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Ollama

For Ollama, you can use the MCP server with the following configuration:

```yaml
# In your Ollama model configuration
mcp_servers:
  - name: my-mcp-server
    command: node
    args: ["/path/to/your/mcp-server/dist/index.js"]
```

## Custom Client Integration

For custom clients, use the standard MCP protocol:

1. **Initialize the connection**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "your-client",
      "version": "1.0.0"
    }
  }
}
```

2. **List available tools**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

3. **Call a tool**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "calculate",
    "arguments": {
      "expression": "2 + 2"
    }
  }
}
```

## Available Tools

Your MCP server provides the following tools:

### search_web
Search the web for information.

**Parameters:**
- `query` (string): The search query to execute
- `maxResults` (number, optional): Maximum number of results to return

**Example:**
```json
{
  "name": "search_web",
  "arguments": {
    "query": "latest AI developments",
    "maxResults": 5
  }
}
```

### get_weather
Get current weather information for a location.

**Parameters:**
- `location` (string): The location to get weather for
- `units` (string, optional): Temperature units ("celsius" or "fahrenheit")

**Example:**
```json
{
  "name": "get_weather",
  "arguments": {
    "location": "New York",
    "units": "celsius"
  }
}
```

### calculate
Perform mathematical calculations.

**Parameters:**
- `expression` (string): Mathematical expression to evaluate

**Example:**
```json
{
  "name": "calculate",
  "arguments": {
    "expression": "2 * (3 + 4)"
  }
}
```

## Troubleshooting

1. **Server not starting**: Make sure you've built the project with `npm run build`
2. **Permission denied**: Ensure the server file has execute permissions
3. **Path issues**: Use absolute paths in your client configuration
4. **Version compatibility**: Ensure your client supports MCP protocol version 2024-11-05 