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
  },
  '<Route> Basic path (/{name}) Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/about')
      .waitForElementVisible('body')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from About!')
  },
  '<Route> Redirect Attribute Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/company')
      .pause(100)
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from About!')
      .assert.urlContains('/about');
  }
};