# Deployment Guide

This guide will help you deploy your Perplexity Chat Clone to various platforms.

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js app
   - Click "Deploy"

3. **Deploy from CLI**:
   ```bash
   vercel
   ```

### Environment Variables:
No environment variables are required for this demo application.

## Netlify

### Steps:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder (after running `npm run build`)
   - Or connect your GitHub repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `out`

## Railway

### Steps:

1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Select your repository

2. **Deploy**:
   - Railway will automatically detect Next.js
   - Click "Deploy"

## Docker

### Create Dockerfile:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Build and run:

```bash
docker build -t perplexity-chat-clone .
docker run -p 3000:3000 perplexity-chat-clone
```

## Manual Server Deployment

### Prerequisites:
- Node.js 18+
- PM2 (for process management)

### Steps:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "perplexity-chat" -- start
   pm2 save
   pm2 startup
   ```

## Environment Configuration

### Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
npm start
```

## Performance Optimization

### For Production:

1. **Enable compression** in `next.config.js`:
   ```javascript
   const nextConfig = {
     compress: true,
     // ... other config
   }
   ```

2. **Add caching headers** for static assets

3. **Use a CDN** for better global performance

## Monitoring

### Recommended tools:
- **Vercel Analytics** (if using Vercel)
- **Sentry** for error tracking
- **Google Analytics** for usage analytics

## Troubleshooting

### Common issues:

1. **Build fails**: Check Node.js version (requires 18+)
2. **API routes not working**: Ensure proper file structure in `app/api/`
3. **Styling issues**: Verify Tailwind CSS is properly configured

### Debug mode:
```bash
DEBUG=* npm run dev
```

## Security Considerations

1. **Environment variables**: Never commit sensitive data
2. **API rate limiting**: Consider adding rate limiting for production
3. **CORS**: Configure CORS if needed for cross-origin requests
4. **HTTPS**: Always use HTTPS in production

## Scaling

### For high traffic:
1. Use a load balancer
2. Implement Redis for session storage
3. Use a CDN for static assets
4. Consider serverless functions for API routes
