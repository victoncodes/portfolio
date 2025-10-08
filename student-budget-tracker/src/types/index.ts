// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  profileMeta?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE' | 'SAVINGS';
  amount: number;
  category: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'SAVINGS';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE' | 'SAVINGS';
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

// Goal Types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalData {
  title: string;
  targetAmount: number;
  deadline?: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
  price?: number;
  published: boolean;
  thumbnail?: string;
  lessons?: Lesson[];
  enrollmentCount?: number;
  userProgress?: Progress;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  contentType: 'TEXT' | 'VIDEO' | 'INTERACTIVE';
  contentRef: string;
  unlockCondition?: any;
  orderIndex: number;
  duration?: number;
  userProgress?: Progress;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  percentComplete: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price?: number;
  thumbnail?: string;
}

export interface CreateLessonData {
  courseId: string;
  title: string;
  contentType: 'TEXT' | 'VIDEO' | 'INTERACTIVE';
  contentRef: string;
  orderIndex: number;
  duration?: number;
  unlockCondition?: any;
}

// Dashboard Types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
  goalProgress: {
    completed: number;
    active: number;
    totalSaved: number;
  };
  recentTransactions: Transaction[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
  categoryBreakdown: Record<string, number>;
  courseProgress: {
    courseId: string;
    courseTitle: string;
    courseThumbnail: string | null;
    progress: number;
    lastAccessed: string;
  }[];
}

export interface FinancialInsights {
  currentPeriod: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    netBalance: number;
  };
  previousPeriod: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    netBalance: number;
  };
  trends: {
    income: number;
    expenses: number;
    savings: number;
  };
  insights: {
    type: 'positive' | 'warning' | 'info';
    title: string;
    message: string;
    icon: string;
  }[];
}

// UI Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Animation Types
export interface AnimationVariants {
  initial: any;
  animate: any;
  exit?: any;
  transition?: any;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}