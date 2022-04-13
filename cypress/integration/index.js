describe('Basic test', () => {
    it('Visits the website', () => {
      cy.visit('localhost:8080');
      cy.get('input[name=firstName]').type('testFirstName');
      cy.get('input[name=lastName]').type('testLastName');
      cy.get('input[name=email]').type('test@scrawl.com');
      cy.get('input[name=password]').type('Vivek1234@#');
      cy.get('.formButton').click();
      cy.get('.auth_link').click();
      cy.get('input[name=email]').type('test@scrawl.com');
      cy.get('input[name=password]').type('Vivek1234@#');
      cy.get('.formButton').click();
    })
  })
  