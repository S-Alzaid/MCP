# ElevenLabs MCP Server Setup

This guide will help you set up your custom MCP server for ElevenLabs conversational agents.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Start the ElevenLabs MCP server:**
   ```bash
   npm run dev:elevenlabs
   ```

4. **Configure in ElevenLabs:**
   - Go to your ElevenLabs dashboard
   - Navigate to Conversational AI → Your Agent → Customization
   - Add MCP server: `http://localhost:3000/mcp`

## Server Details

- **Server URL**: `http://localhost:3000/mcp`
- **Health Check**: `http://localhost:3000/health`
- **Protocol**: HTTP/JSON-RPC 2.0
- **MCP Version**: 2024-11-05

## Available Tools

Your ElevenLabs agent will have access to these tools:

### 1. search_web
Search the web for information.

**Example usage:**
```
User: "What's the latest news about AI?"
Agent: [Uses search_web tool to find current AI news]
```

### 2. get_weather
Get current weather information for any location.

**Example usage:**
```
User: "What's the weather like in New York?"
Agent: [Uses get_weather tool to get current weather data]
```

### 3. calculate
Perform mathematical calculations.

**Example usage:**
```
User: "What's 15% of 200?"
Agent: [Uses calculate tool to compute 15% of 200]
```

## Deployment Options

### Local Development
```bash
npm run dev:elevenlabs
```

### Production (with PM2)
```bash
npm install -g pm2
pm2 start dist/elevenlabs-server.js --name "elevenlabs-mcp"
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/elevenlabs-server.js"]
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Testing Your Server

1. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test MCP Endpoint:**
   ```bash
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{
       "jsonrpc": "2.0",
       "id": 1,
       "method": "tools/list"
     }'
   ```

## ElevenLabs Configuration

In your ElevenLabs dashboard:

1. Go to **Conversational AI**
2. Select your agent
3. Go to **Customization** tab
4. Under **MCP Servers**, click **Add Server**
5. Enter the server URL: `http://localhost:3000/mcp`
6. Save the configuration

## Customizing Tools

To add new tools for your ElevenLabs agent:

1. **Define the tool schema** in `src/tools.ts`:
   ```typescript
   export const NewToolSchema = z.object({
     parameter: z.string().describe("Description"),
   });
   ```

2. **Implement the handler**:
   ```typescript
   export async function handleNewTool(args: z.infer<typeof NewToolSchema>) {
     // Your implementation here
     return {
       content: [{ type: "text" as const, text: "Result" }],
     };
   }
   ```

3. **Add to tools array**:
   ```typescript
   export const tools = [
     // ... existing tools
     {
       name: "new_tool",
       description: "Description",
       inputSchema: NewToolSchema,
     },
   ];
   ```

4. **Add to server handler** in `src/elevenlabs-server.ts`:
   ```typescript
   case "new_tool":
     result = await handleNewTool(args);
     break;
   ```

5. **Rebuild and restart**:
   ```bash
   npm run build
   npm run dev:elevenlabs
   ```

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Try a different port: `PORT=3001 npm run dev:elevenlabs`

### ElevenLabs can't connect
- Ensure server is running: `curl http://localhost:3000/health`
- Check firewall settings
- Verify the URL format: `http://localhost:3000/mcp`

### Tools not working
- Check server logs for errors
- Verify tool names match exactly
- Test individual tools with curl

### Performance issues
- Use production build: `npm run build && npm run start:elevenlabs`
- Consider using PM2 for process management
- Monitor server resources

## Security Considerations

- **Production deployment**: Use HTTPS
- **Authentication**: Add API keys if needed
- **Rate limiting**: Implement request throttling
- **Input validation**: All inputs are validated with Zod schemas
- **Error handling**: Sensitive information is not exposed in errors

## Support

For issues with:
- **MCP Server**: Check this repository
- **ElevenLabs Integration**: Contact ElevenLabs support
- **Tool Development**: Refer to MCP documentation 