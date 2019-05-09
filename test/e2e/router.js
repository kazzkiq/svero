module.exports = {
  '<Router> Render inside elements': (browser) => {
    browser
      .url('http://localhost:5001')
      .waitForElementVisible('main h1')
      .assert.containsText('main h1', 'Hello from Index!')

      .url('http://localhost:5001/does-not-exists')
      .waitForElementVisible('main h1')
      .assert.containsText('main h1', 'Hello from About!')
      .end();
  }
};