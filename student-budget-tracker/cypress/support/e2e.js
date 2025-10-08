// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'log').as('consoleLog')
  cy.stub(win.console, 'error').as('consoleError')
})

// Custom command to login
Cypress.Commands.add('login', (email = 'demo@student.com', password = 'demo123') => {
  cy.visit('/auth/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/auth/login')
})

// Custom command to create transaction
Cypress.Commands.add('createTransaction', (type, amount, category, notes = '') => {
  cy.get('[data-testid="add-transaction-button"]').click()
  cy.get('[data-testid="transaction-type-select"]').select(type)
  cy.get('[data-testid="transaction-amount-input"]').type(amount.toString())
  cy.get('[data-testid="transaction-category-input"]').type(category)
  if (notes) {
    cy.get('[data-testid="transaction-notes-input"]').type(notes)
  }
  cy.get('[data-testid="save-transaction-button"]').click()
})