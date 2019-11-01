module.exports = {
  '<Router> Render inside elements': (browser) => {
    browser
      .url('http://localhost:5001')
      .waitForElementVisible('main h1')
      .assert.containsText('main h1', 'Hello from Index!')

      .url('http://localhost:5001/does-not-exists')
      .waitForElementVisible('main h1')
      .assert.containsText('main h1', 'Not found')
      .end();
  },
  '<Router> can be nested indefinitely': (browser) => {
    browser
      .url('http://localhost:5001/sub')
      .waitForElementVisible('fieldset')
      .url('http://localhost:5001/sub/val')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', 'val!')
      .url('http://localhost:5001/sub/foo')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', 'Foo')
      .url('http://localhost:5001/sub/im/not/exists')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', 'im!')
      .assert.containsText('fieldset', 'Not found: sub/im/not/exists')
      .url('http://localhost:5001/sub/nested')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', '[...]')
      .url('http://localhost:5001/sub/nested/a')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', '[...] A')
      .url('http://localhost:5001/sub/nested/b')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', '[...] C')
      .url('http://localhost:5001/sub/nested/b/d')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', '[...] C')
      .url('http://localhost:5001/sub/nested/b/c/d')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', '[...] not found? C')
      .assert.containsText('fieldset', 'Not found: sub/nested/b/c/d')
      .url('http://localhost:5001/sub/nested/something')
      .waitForElementVisible('fieldset')
      .assert.containsText('fieldset', '[...] {"value":"something"}')
      .end();
  },
  '<Router> can hold routes with nested segments': (browser) => {
    browser
      .url('http://localhost:5001/directory/trademark/create')
      .waitForElementVisible('body h4')
      .assert.containsText('body h4', 'CreateTrademark')
      .url('http://localhost:5001/directory/trademark/update')
      .waitForElementVisible('body h4')
      .assert.containsText('body h4', 'UpdateTrademark')
      .url('http://localhost:5001/directory/embroidery/create')
      .waitForElementVisible('body h4')
      .assert.containsText('body h4', 'CreateEmbroidery')
      .end();
  },
};
