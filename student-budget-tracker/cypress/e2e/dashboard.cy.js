describe('Dashboard', () => {
  beforeEach(() => {
    cy.clearTestData()
    cy.seedTestData()
    // Skip login for now since we don't have a real backend
    // cy.login()
  })

  it.skip('should display dashboard overview', () => {
    cy.visit('/dashboard')
    cy.contains('Welcome back')
    cy.contains('Total Income')
    cy.contains('Total Expenses')
    cy.contains('Total Savings')
    cy.contains('Net Balance')
  })

  it.skip('should display financial overview cards', () => {
    cy.visit('/dashboard')
    cy.get('[data-testid="income-card"]').should('be.visible')
    cy.get('[data-testid="expenses-card"]').should('be.visible')
    cy.get('[data-testid="savings-card"]').should('be.visible')
    cy.get('[data-testid="balance-card"]').should('be.visible')
  })

  it.skip('should display quick actions', () => {
    cy.visit('/dashboard')
    cy.contains('Quick Actions')
    cy.contains('Add Transaction')
    cy.contains('Create Goal')
    cy.contains('Browse Courses')
    cy.contains('View Analytics')
  })

  it.skip('should display recent transactions', () => {
    cy.visit('/dashboard')
    cy.contains('Recent Transactions')
    cy.get('[data-testid="transaction-item"]').should('have.length.at.least', 1)
  })

  it.skip('should display financial insights when available', () => {
    cy.visit('/dashboard')
    cy.get('[data-testid="insights-section"]').should('be.visible')
    cy.get('[data-testid="insight-item"]').should('have.length.at.least', 1)
  })

  it.skip('should display goals overview', () => {
    cy.visit('/dashboard')
    cy.contains('Goals Overview')
    cy.contains('Active Goals')
    cy.contains('Completed Goals')
    cy.contains('Total Saved')
  })

  it.skip('should navigate to transactions page from quick actions', () => {
    cy.visit('/dashboard')
    cy.contains('Add Transaction').click()
    cy.url().should('include', '/transactions')
  })

  it.skip('should navigate to goals page from quick actions', () => {
    cy.visit('/dashboard')
    cy.contains('Create Goal').click()
    cy.url().should('include', '/goals')
  })

  it.skip('should navigate to learning center from quick actions', () => {
    cy.visit('/dashboard')
    cy.contains('Browse Courses').click()
    cy.url().should('include', '/learn')
  })

  it.skip('should navigate to analytics from quick actions', () => {
    cy.visit('/dashboard')
    cy.contains('View Analytics').click()
    cy.url().should('include', '/analytics')
  })

  it.skip('should be responsive on mobile devices', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard')
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
    cy.get('[data-testid="sidebar"]').should('not.be.visible')
  })

  it.skip('should open mobile menu on small screens', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard')
    cy.get('[data-testid="mobile-menu-button"]').click()
    cy.get('[data-testid="sidebar"]').should('be.visible')
  })
})