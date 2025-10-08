# Deployment Guide 🚀

This guide covers deploying the Student Budget Tracker to production environments.

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vercel)      │◄──►│  (Render/Rail)  │◄──►│  (PostgreSQL)   │
│   Next.js PWA   │    │   Node.js API   │    │   Managed DB    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN Assets    │    │   File Storage  │    │   Monitoring    │
│  (Cloudinary)   │    │  (Cloudinary)   │    │   (Sentry)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected
- Domain name (optional)

### Setup Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel link
   ```

2. **Environment Variables**
   Set in Vercel dashboard or via CLI:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   # Enter: https://your-backend-domain.com/api
   ```

3. **Build Configuration**
   Vercel automatically detects Next.js. Custom config in `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "regions": ["iad1"],
     "functions": {
       "app/**": {
         "maxDuration": 30
       }
     }
   }
   ```

4. **Deploy**
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

### Performance Optimization

1. **Enable Analytics**
   ```bash
   vercel analytics enable
   ```

2. **Configure Caching**
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate' }
           ]
         }
       ]
     }
   }
   ```

## 🔧 Backend Deployment (Render)

### Prerequisites
- Render account
- PostgreSQL database
- Environment variables

### Setup Steps

1. **Create Web Service**
   - Connect GitHub repository
   - Select `backend` as root directory
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-production-jwt-secret-256-bits-minimum
   JWT_REFRESH_SECRET=your-production-refresh-secret-256-bits-minimum
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-domain.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Database Setup**
   ```bash
   # Run migrations on deploy
   npm run prisma:migrate
   npm run prisma:generate
   ```

4. **Health Check**
   Render will monitor: `GET /health`

### Alternative: Railway Deployment

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and initialize
   railway login
   railway init
   ```

2. **Deploy**
   ```bash
   railway up
   ```

3. **Add Database**
   ```bash
   railway add postgresql
   ```

## 🗄 Database Setup

### Managed PostgreSQL (Recommended)

**Render PostgreSQL**:
- Automatic backups
- Connection pooling
- SSL encryption
- Monitoring dashboard

**Supabase**:
- Built-in auth (optional)
- Real-time subscriptions
- Dashboard and SQL editor
- Generous free tier

**Railway PostgreSQL**:
- Integrated with app deployment
- Automatic connection string
- Built-in monitoring

### Configuration

1. **Connection String Format**
   ```
   postgresql://username:password@hostname:port/database?sslmode=require
   ```

2. **Connection Pooling**
   ```javascript
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL") // For migrations
   }
   ```

3. **Migrations**
   ```bash
   # Production migration
   npx prisma migrate deploy
   
   # Generate client
   npx prisma generate
   ```

## 🔐 Security Configuration

### SSL/TLS
- Vercel: Automatic HTTPS
- Render: Automatic SSL certificates
- Custom domains: Configure DNS properly

### Environment Secrets
```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS Configuration
```javascript
// backend/src/server.ts
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true
}))
```

### Rate Limiting
```javascript
// Adjust for production load
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

1. **Setup**
   ```bash
   npm install @sentry/nextjs @sentry/node
   ```

2. **Configuration**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
   })
   ```

### Performance Monitoring

1. **Vercel Analytics**
   ```javascript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

2. **Custom Metrics**
   ```javascript
   // Track custom events
   import { track } from '@vercel/analytics'
   
   track('transaction_created', { category: 'expense', amount: 50 })
   ```

### Logging

1. **Structured Logging**
   ```javascript
   // backend/src/utils/logger.ts
   import winston from 'winston'
   
   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.Console(),
       new winston.transports.File({ filename: 'error.log', level: 'error' })
     ]
   })
   ```

## 🚀 CI/CD Pipeline

### GitHub Actions Secrets

Set these in your repository settings:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
RENDER_STAGING_DEPLOY_HOOK=https://api.render.com/deploy/...
RENDER_PRODUCTION_DEPLOY_HOOK=https://api.render.com/deploy/...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
LHCI_GITHUB_APP_TOKEN=your-lighthouse-token
```

### Deployment Strategy

1. **Feature Branch** → Vercel Preview Deployment
2. **Develop Branch** → Staging Environment
3. **Main Branch** → Production Environment

### Rollback Strategy

1. **Vercel**: Instant rollback via dashboard
2. **Render**: Redeploy previous commit
3. **Database**: Use backup restoration

## 🔧 Domain & DNS Configuration

### Custom Domain Setup

1. **Add Domain to Vercel**
   ```bash
   vercel domains add yourdomain.com
   ```

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

3. **SSL Certificate**
   - Automatic via Vercel/Render
   - Custom certificates supported

## 📱 PWA Deployment Checklist

- [ ] Manifest file configured
- [ ] Service worker registered
- [ ] Icons generated (all sizes)
- [ ] Offline functionality tested
- [ ] Install prompts working
- [ ] App store optimization

### PWA Validation

```bash
# Test PWA compliance
npx lighthouse https://yourdomain.com --view
```

## 🧪 Production Testing

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Security audit clean
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Environment variables set
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Post-deployment Verification

```bash
# Health checks
curl https://api.yourdomain.com/health
curl https://yourdomain.com

# Performance test
lighthouse https://yourdomain.com

# Security scan
npm audit --production
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs
   
   # Local build test
   npm run build
   ```

2. **Database Connection**
   ```bash
   # Test connection
   npx prisma db pull
   
   # Check connection string
   echo $DATABASE_URL
   ```

3. **Environment Variables**
   ```bash
   # List Vercel env vars
   vercel env ls
   
   # Check Render env vars in dashboard
   ```

### Performance Issues

1. **Slow API Responses**
   - Check database query performance
   - Enable connection pooling
   - Add Redis caching layer

2. **Large Bundle Size**
   - Analyze bundle: `npx @next/bundle-analyzer`
   - Enable tree shaking
   - Lazy load components

### Monitoring Alerts

Set up alerts for:
- Error rate > 1%
- Response time > 2s
- Database connection failures
- Memory usage > 80%
- Disk space < 20%

## 📞 Support Contacts

- **Vercel Support**: support@vercel.com
- **Render Support**: support@render.com
- **Railway Support**: help@railway.app
- **Emergency Escalation**: [Your team contact]

---

**Remember**: Always test deployments in staging before production! 🛡️