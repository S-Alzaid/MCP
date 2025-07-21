# 🎯 ElevenLabs MCP Requirements

Based on the [ElevenLabs MCP documentation](https://elevenlabs.io/docs/conversational-ai/customization/mcp#getting-started), here are the specific requirements for successful integration.

## 🔧 **Transport Requirements**

ElevenLabs supports **two transport types**:

### 1. **SSE (Server-Sent Events)**
- Real-time streaming communication
- Uses EventSource API
- Bidirectional communication

### 2. **HTTP Streamable Transport** ⭐ **RECOMMENDED**
- Standard HTTP requests
- JSON-RPC 2.0 protocol
- Simpler to implement and debug

## 📋 **MCP Protocol Requirements**

### **Required Endpoints:**
- `POST /mcp` - Main MCP endpoint
- `GET /health` - Health check (optional but recommended)

### **Required Methods:**
1. **`initialize`** - Handshake with client
2. **`tools/list`** - List available tools
3. **`tools/call`** - Execute tool calls

### **Response Format:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { ... }
}
```

## 🚀 **Updated Server Implementation**

I've created `elevenlabs-streamable.js` that meets all ElevenLabs requirements:

### **Key Features:**
- ✅ **Streamable HTTP transport**
- ✅ **Proper JSON-RPC 2.0 responses**
- ✅ **Detailed logging for debugging**
- ✅ **CORS enabled**
- ✅ **Health check endpoint**
- ✅ **ElevenLabs-compatible tool schemas**

### **Tool Schema Format:**
```javascript
{
  name: "tool_name",
  description: "Tool description",
  inputSchema: {
    type: "object",
    properties: {
      parameter: { type: "string", description: "Parameter description" }
    },
    required: ["parameter"]
  }
}
```

## 🔄 **Deployment Updates**

### **Railway Configuration:**
```json
{
  "startCommand": "npm run start:streamable"
}
```

### **Docker Configuration:**
```dockerfile
CMD ["node", "elevenlabs-streamable.js"]
```

## 🧪 **Testing Your Server**

### **1. Health Check:**
```bash
curl https://your-app.railway.app/health
```

### **2. Initialize:**
```bash
curl -X POST https://your-app.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "elevenlabs", "version": "1.0.0"}}}'
```

### **3. List Tools:**
```bash
curl -X POST https://your-app.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

## 🎯 **ElevenLabs Configuration**

### **Step 1: Deploy Updated Server**
1. Push your changes to GitHub
2. Railway will automatically redeploy with the new streamable server

### **Step 2: Configure in ElevenLabs**
1. Go to ElevenLabs Dashboard → Conversational AI → Your Agent
2. Click **Customization** tab
3. Under **MCP Servers**, click **Add Server**
4. Fill in:
   - **Server Type**: `Streamable HTTP` ⭐
   - **URL**: `https://your-app.railway.app/mcp`
   - **Secret Token**: `None`
   - **Tool Approval**: `Always Ask (Recommended)`
   - **Check**: "I trust this server"

### **Step 3: Test Connection**
1. Click **"Add Integration"**
2. Click **"Test Connection"**
3. Should show your tools: `search_web`, `get_weather`, `calculate`

## 🚨 **Troubleshooting**

### **If still failing:**

1. **Check Railway logs** for any errors
2. **Verify URL format**: Must end with `/mcp`
3. **Try SSE instead**: If "Streamable HTTP" doesn't work, try "SSE"
4. **Check CORS**: Server must allow cross-origin requests
5. **Verify JSON-RPC format**: All responses must follow JSON-RPC 2.0

### **Common Issues:**
- **"MCP tool extraction failed"**: Usually means server isn't responding correctly
- **"Failed to connect"**: Check if server is running and accessible
- **"No tools found"**: Check if `tools/list` endpoint returns proper format

## 🎉 **Expected Result**

Once configured correctly, your ElevenLabs agent will:
- ✅ Connect to your MCP server
- ✅ List available tools
- ✅ Be able to call tools when needed
- ✅ Provide enhanced capabilities to users

The updated server should now work perfectly with ElevenLabs! 🚀 