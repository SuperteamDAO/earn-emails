# Step 1: Base Image
FROM node:16-alpine

# Step 2: Set Working Directory
WORKDIR /app

# Step 3: Dependencies
COPY package*.json ./

# Step 4: Install Dependencies
RUN npm install

# If you have build-time environment variables, add them here
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# Step 5: Copy Source Code
COPY . .

# Step 6: Build Application
# Since you are using tsx for development, ensure your tsx build command is correctly set up in your package.json
# For this example, I'll assume you need to run `tsx` to build your TypeScript files.
RUN npm run build

# Step 7: Start Command
# This command depends on how you start your application and workers.
# Here's an example if you start your server with `node dist/index.js`
CMD ["node", "dist/index.js"]

# If you use a different command to start your application or manage workers, adjust the CMD accordingly.
