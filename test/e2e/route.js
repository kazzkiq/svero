module.exports = {
  '<Route> Wildcard (*) Tests': (browser) => {
    browser
      // Checking if "/" Route loads Index Component
      .url('http://localhost:5001')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from Index!')

      // Checking if non-existent route redirects to About Page
      .url('http://localhost:5001/does-not-exists')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from About!')
      .end();
  },
  '<Route> Slot rendering (/slot) Tests': (browser) => {
    browser
      .url('http://localhost:5001/slot')
      .waitForElementVisible('h3')
      .assert.containsText('h3', 'It works!')
      .end();
  },
  '<Route> Basic path (/{name}) Tests': (browser) => {
    browser
      .url('http://localhost:5001/about')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from About!')
      .end();
  },
  '<Route> Single param (/:name) Tests': (browser) => {
    browser
      .url('http://localhost:5001/user/Amanda')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello Amanda!')
      .end();
  },
  '<Route> Multiple params (/:name/:age) Tests': (browser) => {
    browser
      .url('http://localhost:5001/user/Amanda/30')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello Amanda, 30yo!')
      .end();
  },
  '<Route> Redirect Attribute Tests': (browser) => {
    browser
      .url('http://localhost:5001/company')
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from About!')
      .assert.urlContains('/about')
      .end();
  },
  '<Route> Redirect Attribute Tests': (browser) => {
    browser
      // Check if /admin-false redirects to index
      .url('http://localhost:5001/admin-false')
      .pause(100)
      .waitForElementVisible('h1')
      .assert.containsText('h1', 'Hello from Index!')
      .assert.urlContains('/')

      // Check if /admin-true redirects to the right page
      .url('http://localhost:5001/admin-true')
      .waitForElementVisible('h2')
      .assert.containsText('h2', 'Admin Panel')
      .assert.urlContains('/admin-true')
      .end();
  },
};
