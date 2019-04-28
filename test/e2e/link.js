module.exports = {
  '<Link> Href Attribute Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/user/Amanda')
      .waitForElementVisible('a')
      .click('a')
      .pause(100)
      .assert.containsText('h1', 'Hello from About!')
      .assert.urlContains('/about')
      .end();
  },
  '<Link> ClassName Attribute Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/user/Amanda')
      .waitForElementVisible('a.red')
      .end();
  },
  '<Link> <slot> Text Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/user/Amanda')
      .waitForElementVisible('a.red')
      .assert.containsText('a.red', 'Go to About')
      .end();
  },
};