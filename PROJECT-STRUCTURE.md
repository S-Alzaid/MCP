# Project Structure Documentation

## Overview
This is an ElevenLabs MCP (Model Context Protocol) server built in pure JavaScript for optimal deployment compatibility.

## File Structure & Purpose

### Core Server Files
- **`elevenlabs-true-streamable.js`** - Main server file (pure JavaScript)
  - **Why**: ElevenLabs requires "Streamable HTTP" with chunked transfer encoding
  - **Purpose**: Handles JSON-RPC 2.0 protocol over HTTP with true streaming
  - **Critical**: Contains hardcoded tool schemas and handlers for deployment reliability

### Configuration Files
- **`package.json`** - Project configuration and dependencies
  - **Scripts**: Only `npm start` and `npm test` (no build step needed)
  - **Dependencies**: Express, CORS, and MCP SDK
  - **Why no TypeScript**: Pure JS for simpler deployment and no compilation issues

- **`railway.json`** - Railway deployment configuration
  - **Build Command**: `npm install` (no build step)
  - **Start Command**: `npm start`
  - **Why**: Railway expects a build step, but we use pure JS

- **`Dockerfile`** - Docker container configuration
  - **Why**: Alternative deployment option
  - **Note**: Uses `npm ci` for production installs

### Documentation Files
- **`README.md`** - Main project documentation
- **`ELEVENLABS-INTEGRATION.md`** - ElevenLabs-specific setup guide
- **`ELEVENLABS-REQUIREMENTS.md`** - Technical requirements for ElevenLabs
- **`PROJECT-STRUCTURE.md`** - This file (deployment and structure guide)

### Deployment Files
- **`docker-compose.yml`** - Local Docker development
- **`client-configs/`** - Example client configurations

## Deployment Requirements

### Railway Deployment
- **Build Command**: `npm install && npm run build` (build script is a no-op)
- **Start Command**: `npm start`
- **Health Check**: `/health` endpoint
- **Critical**: Build script exists but does nothing (satisfies Railway's expectations)

### ElevenLabs Requirements
- **Transport**: Streamable HTTP (chunked transfer encoding)
- **Protocol**: JSON-RPC 2.0
- **Headers**: Must include `Transfer-Encoding: chunked`
- **Response**: Use `res.write()` and `res.end()` for streaming

## Why This Structure?

### 1. Pure JavaScript Approach
- **Problem Solved**: TypeScript compilation issues during deployment
- **Benefit**: No build step required, faster deployments
- **Trade-off**: Less type safety, but more reliable deployment

### 2. Single Server File
- **Problem Solved**: Complex file dependencies and import issues
- **Benefit**: Self-contained, easier to debug and deploy
- **Trade-off**: Larger file, but more maintainable

### 3. Hardcoded Tools
- **Problem Solved**: Dynamic loading issues in production
- **Benefit**: Guaranteed to work in all environments
- **Trade-off**: Less flexible, but more reliable

## Deployment History & Lessons Learned

### Failed Attempts
1. **TypeScript + Build Step**: Failed on Railway due to `tsc` not found
2. **Dynamic Tool Loading**: Failed due to module resolution issues
3. **Standard HTTP**: Failed ElevenLabs integration (not streamable)

### Successful Approach
1. **Pure JavaScript**: No compilation needed
2. **Single File**: No import/export issues
3. **True Streaming**: Proper chunked transfer encoding
4. **Hardcoded Tools**: No dynamic loading failures

## Critical Rules (DO NOT BREAK)

### ✅ DO
- Keep `railway.json` build command as `npm install && npm run build`
- Keep `package.json` build script as a no-op (`echo 'No build step needed'`)
- Maintain `Transfer-Encoding: chunked` headers
- Use `res.write()` and `res.end()` for responses
- Keep all tools hardcoded in the main file

### ❌ DON'T
- Remove the build script from package.json (Railway expects it)
- Add actual TypeScript build steps to Railway config
- Remove streaming headers from responses
- Split tools into separate modules
- Add complex build processes

## Future Changes Checklist

Before making ANY changes to this project:

1. **Check this file** for deployment requirements
2. **Test locally** with `npm start`
3. **Verify Railway config** doesn't include build steps
4. **Test ElevenLabs integration** after deployment
5. **Update this documentation** if structure changes

## Emergency Recovery

If deployment fails:
1. Check Railway logs for build command errors
2. Verify `package.json` scripts match Railway config
3. Ensure no TypeScript dependencies were added
4. Test the exact deployment command locally

---
**Last Updated**: 2025-07-21
**Reason**: Fixed Railway deployment failure after cleanup
**Lesson**: Never remove build processes without updating deployment configs 