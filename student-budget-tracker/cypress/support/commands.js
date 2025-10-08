// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to seed test data
Cypress.Commands.add('seedTestData', () => {
  // This would typically make API calls to seed the database
  // For now, we'll use localStorage to mock some data
  const testUser = {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'STUDENT'
  }
  
  const testTransactions = [
    {
      id: '1',
      type: 'INCOME',
      amount: 1000,
      category: 'Part-time Job',
      date: new Date().toISOString(),
      notes: 'Weekly salary'
    },
    {
      id: '2',
      type: 'EXPENSE',
      amount: 50,
      category: 'Food',
      date: new Date().toISOString(),
      notes: 'Groceries'
    }
  ]

  cy.window().then((win) => {
    win.localStorage.setItem('testUser', JSON.stringify(testUser))
    win.localStorage.setItem('testTransactions', JSON.stringify(testTransactions))
  })
})

// Custom command to clear test data
Cypress.Commands.add('clearTestData', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

// Custom command to wait for API response
Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201, 204])
  })
})

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', () => {
  // This would integrate with axe-core for accessibility testing
  // For now, we'll do basic checks
  cy.get('h1').should('exist')
  cy.get('main').should('exist')
  cy.get('button').should('have.attr', 'type')
})