# 🎯 ElevenLabs MCP Server - Ready for Integration!

Your custom MCP server is now ready to be integrated with your ElevenLabs conversational agent!

## ✅ What's Ready

- **HTTP MCP Server**: Running on `http://localhost:3000/mcp`
- **3 Custom Tools**: search_web, get_weather, calculate
- **Production Ready**: Docker support, health checks, error handling
- **ElevenLabs Compatible**: Follows MCP protocol 2024-11-05

## 🚀 Quick Integration Steps

### 1. Start Your Server
```bash
# Development mode
npm run dev:elevenlabs

# OR Production mode
npm run build
npm run start:elevenlabs

# OR Docker
docker-compose up -d
```

### 2. Configure in ElevenLabs Dashboard

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/)
2. Navigate to **Conversational AI** → **Your Agent**
3. Click **Customization** tab
4. Under **MCP Servers**, click **Add Server**
5. Enter: `http://localhost:3000/mcp`
6. Save configuration

### 3. Test Your Integration

Your agent can now use these tools:

```
User: "What's the weather in London?"
Agent: [Uses get_weather tool] "The current weather in London is 18°C with partly cloudy skies."

User: "Calculate 25% of 400"
Agent: [Uses calculate tool] "25% of 400 is 100."

User: "Search for the latest AI news"
Agent: [Uses search_web tool] "Here are the latest AI developments..."
```

## 🔧 Server Details

- **URL**: `http://localhost:3000/mcp`
- **Health Check**: `http://localhost:3000/health`
- **Protocol**: HTTP/JSON-RPC 2.0
- **CORS**: Enabled for cross-origin requests
- **Error Handling**: Comprehensive error responses

## 🛠️ Available Tools

### 1. search_web
**Purpose**: Search the web for current information
**Parameters**: 
- `query` (string): Search term
- `maxResults` (number, optional): Number of results

### 2. get_weather
**Purpose**: Get current weather for any location
**Parameters**:
- `location` (string): City/location name
- `units` (string, optional): "celsius" or "fahrenheit"

### 3. calculate
**Purpose**: Perform mathematical calculations
**Parameters**:
- `expression` (string): Math expression (e.g., "2 + 2 * 3")

## 🌐 Deployment Options

### Local Development
```bash
npm run dev:elevenlabs
```

### Production (PM2)
```bash
npm install -g pm2
pm2 start dist/elevenlabs-server.js --name "elevenlabs-mcp"
pm2 save
pm2 startup
```

### Docker
```bash
docker-compose up -d
```

### Cloud Deployment
- **Railway**: Connect GitHub repo
- **Render**: Deploy from Docker
- **Heroku**: Use Procfile
- **Vercel**: Serverless deployment

## 🔍 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### List Tools
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

### Test Tool Call
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "calculate", "arguments": {"expression": "2 + 2"}}}'
```

## 📝 Adding Custom Tools

1. **Define Schema** in `src/tools.ts`:
```typescript
export const MyToolSchema = z.object({
  parameter: z.string().describe("Description"),
});
```

2. **Implement Handler**:
```typescript
export async function handleMyTool(args: z.infer<typeof MyToolSchema>) {
  // Your logic here
  return {
    content: [{ type: "text" as const, text: "Result" }],
  };
}
```

3. **Add to Server** in `src/elevenlabs-server.ts`:
```typescript
case "my_tool":
  result = await handleMyTool(args);
  break;
```

4. **Rebuild & Restart**:
```bash
npm run build
npm run dev:elevenlabs
```

## 🚨 Troubleshooting

### Server Won't Start
- Check port availability: `netstat -an | findstr :3000`
- Try different port: `PORT=3001 npm run dev:elevenlabs`

### ElevenLabs Can't Connect
- Verify server is running: `curl http://localhost:3000/health`
- Check firewall settings
- Ensure URL format: `http://localhost:3000/mcp`

### Tools Not Working
- Check server logs for errors
- Verify tool names match exactly
- Test with curl commands above

## 🔒 Security Notes

- **Production**: Use HTTPS
- **Authentication**: Add API keys if needed
- **Rate Limiting**: Implement request throttling
- **Input Validation**: All inputs validated with Zod

## 📞 Support

- **MCP Server Issues**: Check this repository
- **ElevenLabs Integration**: [ElevenLabs Support](https://elevenlabs.io/support)
- **MCP Protocol**: [MCP Documentation](https://modelcontextprotocol.io/)

---

## 🎉 You're All Set!

Your ElevenLabs conversational agent now has access to custom tools through your MCP server. The agent can search the web, get weather information, and perform calculations - making it much more capable and useful for your users!

**Next Steps:**
1. Deploy to production
2. Add more custom tools
3. Monitor usage and performance
4. Iterate and improve based on user feedback 