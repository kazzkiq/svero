module.exports = {
  'navigateTo(path) navigate to new path': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/user/Jon')
      .waitForElementVisible('button')
      .click('button')
      .pause(100)
      .assert.containsText('h1', 'Hello from About!')
      .assert.urlContains('/about')
      .end();
  },
  'navigateTo(path) empty parameter does nothing': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/user/Jon')
      .waitForElementVisible('em')
      .click('em')
      .pause(100)
      .assert.containsText('h1', 'Hello Jon!')
      .assert.urlContains('/user/Jon')
      .end();
  },
  'navigateTo(path) parameter not starting with slash (/) does nothing': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001/user/Jon')
      .waitForElementVisible('strong')
      .click('strong')
      .pause(100)
      .assert.containsText('h1', 'Hello Jon!')
      .assert.urlContains('/user/Jon')
      .end();
  }
};