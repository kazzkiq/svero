module.exports = {
  '<Route> Wildcard (*) Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001')
      .waitForElementVisible('body')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from Index!')

      // Checking if non-existent route still loads Index Component
      .url('http://localhost:5001/does-not-exists')
      .waitForElementVisible('body')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from Index!')
      .end();
  }
};