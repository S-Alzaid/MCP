#!/bin/bash

# Install dependencies
npm install

# Ensure TypeScript is available
npx tsc --version

# Build the project
npm run build

# Verify build output
ls -la dist/

echo "Build completed successfully!" 