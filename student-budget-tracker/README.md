# Student Budget Tracker 💰

A comprehensive Progressive Web App (PWA) for student budget tracking, financial goal setting, and financial education. Built with modern technologies and designed for mobile-first usage.

## ✨ Features

### 📊 Budget Tracking
- **Smart Transaction Management**: Track income, expenses, and savings with intuitive categorization
- **Real-time Insights**: Visual dashboards with charts and analytics
- **Monthly Trends**: Understand spending patterns over time
- **Category Breakdown**: Detailed analysis of spending by category

### 🎯 Savings Goals
- **Goal Setting**: Create and track multiple savings goals
- **Progress Visualization**: Beautiful progress indicators and milestone celebrations
- **Deadline Tracking**: Set target dates and receive reminders
- **Achievement System**: Gamified experience with rewards

### 📚 Learning Center
- **Interactive Courses**: Mini-Udemy style financial education platform
- **Video Lessons**: Comprehensive financial literacy content
- **Progress Tracking**: Track learning progress and earn certificates
- **Unlockable Content**: Lessons unlock based on achievements

### 👨‍💼 Admin Panel
- **User Management**: Comprehensive user administration
- **Content Management**: Create and manage courses and lessons
- **Analytics Dashboard**: Platform-wide insights and metrics
- **Role-based Access**: Secure permission system

### 🎨 Premium UX
- **Senior-level Animations**: Framer Motion powered microinteractions
- **Mobile-first Design**: Optimized for phone usage
- **PWA Capabilities**: Installable, offline-capable, native-like experience
- **Accessibility**: WCAG 2.1 AA compliant

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations and microinteractions
- **Lottie React** - Vector animations
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form handling and validation
- **SWR** - Data fetching and caching

### Backend
- **Node.js + Express** - Server runtime and framework
- **TypeScript** - Full-stack type safety
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Joi** - Request validation
- **Helmet + CORS** - Security middleware

### DevOps & Infrastructure
- **Vercel** - Frontend hosting and deployment
- **Render/Railway** - Backend hosting
- **GitHub Actions** - CI/CD pipeline
- **Cypress** - E2E testing
- **Jest + React Testing Library** - Unit testing
- **Lighthouse CI** - Performance monitoring
- **Sentry** - Error tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/student-budget-tracker.git
   cd student-budget-tracker
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   
   Frontend (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
   
   Backend (`backend/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/student_budget_tracker"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start the development servers**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (in a new terminal):
   ```bash
   npm run dev
   ```

7. **Open the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📱 PWA Installation

The app can be installed on mobile devices and desktops:

1. **Mobile (Chrome/Safari)**:
   - Visit the app in your browser
   - Tap "Add to Home Screen" when prompted
   - Or use the browser menu → "Install App"

2. **Desktop (Chrome/Edge)**:
   - Click the install icon in the address bar
   - Or use Chrome menu → "Install Student Budget Tracker"

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run Cypress tests headlessly
npm run e2e

# Open Cypress test runner
npm run e2e:open
```

### Backend Tests
```bash
cd backend
npm run test
```

## 🏗 Project Structure

```
student-budget-tracker/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   └── layout/           # Layout components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility libraries
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── prisma/               # Database schema and migrations
│   └── tests/                # Backend tests
├── cypress/                  # E2E tests
├── public/                   # Static assets
└── .github/                  # GitHub Actions workflows
```

## 🔐 Security Features

- **JWT Authentication** with secure refresh tokens
- **Password Hashing** using bcrypt with salt
- **Rate Limiting** on authentication endpoints
- **Input Validation** on all API endpoints
- **CORS Protection** with configurable origins
- **Security Headers** via Helmet middleware
- **SQL Injection Prevention** via Prisma ORM
- **XSS Protection** via Content Security Policy

## 📊 Performance Targets

- **Load Time**: < 2s on 3G Lite
- **Lighthouse Score**: ≥ 90 for all categories
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Core Web Vitals**: All metrics in "Good" range

## 🚢 Deployment

### Staging Deployment
Automatically deployed to staging on push to `develop` branch.

### Production Deployment
Automatically deployed to production on push to `main` branch after all tests pass.

### Manual Deployment

1. **Frontend (Vercel)**:
   ```bash
   npm run build
   vercel --prod
   ```

2. **Backend (Render/Railway)**:
   ```bash
   cd backend
   npm run build
   # Deploy via platform-specific CLI or web interface
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Maintain 70%+ code coverage
- Follow conventional commit messages
- Ensure accessibility compliance
- Test on mobile devices

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user

### Transaction Endpoints
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get statistics

### Goal Endpoints
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `PATCH /api/goals/:id/add` - Add money to goal
- `DELETE /api/goals/:id` - Delete goal

### Course Endpoints
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (instructor/admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/lessons` - Get course lessons

## 📈 Roadmap

### Phase 1 (Current)
- [x] Core budget tracking
- [x] Basic goal setting
- [x] User authentication
- [x] PWA capabilities

### Phase 2
- [ ] Advanced analytics
- [ ] Spending predictions
- [ ] Bill reminders
- [ ] Bank account integration

### Phase 3
- [ ] Social features
- [ ] Challenges and competitions
- [ ] Advanced learning paths
- [ ] AI-powered insights

## 📞 Support

- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues](https://github.com/your-username/student-budget-tracker/issues)
- **Email**: support@studentbudgettracker.com
- **Discord**: [Community Server]

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern fintech apps
- Financial education content curated by certified financial planners
- Open source community for amazing tools and libraries
- Beta testers and student feedback

---

**Made with ❤️ for students, by developers who understand the struggle.**