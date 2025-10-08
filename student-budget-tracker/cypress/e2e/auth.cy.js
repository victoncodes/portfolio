describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearTestData()
  })

  it('should display the landing page for unauthenticated users', () => {
    cy.visit('/')
    cy.contains('Master Your Student Budget')
    cy.contains('Get Started Free')
    cy.contains('Sign In')
  })

  it('should navigate to login page', () => {
    cy.visit('/')
    cy.contains('Sign In').click()
    cy.url().should('include', '/auth/login')
    cy.contains('Welcome Back')
  })

  it('should navigate to register page', () => {
    cy.visit('/')
    cy.contains('Get Started Free').click()
    cy.url().should('include', '/auth/register')
    cy.contains('Create Account')
  })

  it('should show validation errors on empty login form', () => {
    cy.visit('/auth/login')
    cy.get('button[type="submit"]').click()
    cy.contains('Email is required')
    cy.contains('Password is required')
  })

  it('should show validation errors on empty registration form', () => {
    cy.visit('/auth/register')
    cy.get('button[type="submit"]').click()
    cy.contains('Name is required')
    cy.contains('Email is required')
    cy.contains('Password is required')
  })

  it('should validate email format', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.contains('Please enter a valid email')
  })

  it('should validate password confirmation on registration', () => {
    cy.visit('/auth/register')
    cy.get('input[placeholder*="full name"]').type('Test User')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[placeholder*="Create a password"]').type('password123')
    cy.get('input[placeholder*="Confirm your password"]').type('different-password')
    cy.get('button[type="submit"]').click()
    cy.contains('Passwords do not match')
  })

  it('should navigate between login and register pages', () => {
    cy.visit('/auth/login')
    cy.contains('Sign up').click()
    cy.url().should('include', '/auth/register')
    
    cy.contains('Sign in').click()
    cy.url().should('include', '/auth/login')
  })

  // Note: These tests would require a test database and API
  // For now, they serve as documentation of expected behavior
  
  it.skip('should successfully register a new user', () => {
    cy.visit('/auth/register')
    cy.get('input[placeholder*="full name"]').type('Test User')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[placeholder*="Create a password"]').type('password123')
    cy.get('input[placeholder*="Confirm your password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it.skip('should successfully login with valid credentials', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type('demo@student.com')
    cy.get('input[type="password"]').type('demo123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it.skip('should show error for invalid credentials', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid credentials')
  })
})