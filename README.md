[![npm version](https://badge.fury.io/js/svero.svg)](https://www.npmjs.com/package/svero)
[![Build Status](https://travis-ci.org/kazzkiq/svero.svg?branch=master)](https://travis-ci.org/kazzkiq/svero)

<p align="center">
  svero (<b>Sve</b>lte <b>Ro</b>uter): A simple router for Svelte 3.
</p>

## First things first

svero is intented to be used in SPA (Single Page Applications) making usage of `pushState` and History API. We're assuming that you already know how to configure your front-end server (being it dev or production) to serve all path requests to `index.html`.

If you're not familiar with the terms SPA, `pushState` or History API, you should probably be reading these first:

<small>http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash</small><br>
<small>https://css-tricks.com/using-the-html5-history-api/</small><br>
<small>https://diveinto.html5doctor.com/history.html</small><br>
<small>https://developer.mozilla.org/pt-BR/docs/Web/API/History</small><br>

## Installation

Since it's exported in CommonJS format, you should be using it with a module bundler such as [Rollup](https://github.com/sveltejs/template/tree/v3) or Webpack.

You can install svero via npm:

```
npm install --save svero
```

## Usage

The usage is super simple:

```html
<!-- ./App.svelte -->
<script>
  import { Router, Route } from 'svero';

  import Index from './pages/Index.svelte';
  import About from './pages/About.svelte';
  import Employees from './pages/Employees.svelte';

  let employees = [{ id: 1, name: 'Bill'}, { id:2, name: 'Sven' }];
</script>

<Router>
  <Route path="*" component={Index} />
  <Route path="/about" component={About} />
  <Route path="/about/:who/123/:where" component={About} />
  <Route path="/employees">
    <Employees {employees}/>
  </Route>
</Router>
```

The `*` wildcard simply works as a fallback. If a route fails to meet any other path, it then loads the path with the `*`. If there is no wildcard route and the route did not meet any other path, nothing is loaded.

Your custom props can be passed by putting your component in the Route `slot` (Employees example above).

Paths with parameters (`:param`) are passed to components via props: `router.params`.

> Parameters like `*param` will capture the rest of segments. You can access them as `router.params._` like other params.

A component loaded by `<Route>` receives a property with route details:

```html
<!-- ./pages/About.svelte -->
<script>
  export let router = {};

  // Those contains useful information about current route status
  router.path; // /test
  router.route; // Route Object
  router.params; // /about/bill/123/kansas { who: 'bill', where: 'kansas' }
</script>
```

Additional properties are passed to the mounted component, e.g.

```html
<Route component={Test} title="Some description" />
```

Also, you can pass an object:

```html
<Route component={Test} props={myProps} />
```

> `Route` props are omitted, but all remaining ones are passed to `Test`.

Routes can also render any given markup when they're active, e.g.

```html
<Route path="/static-path">
  <h1>It works!</h1>
</Route>
```

> You can access `router` within `<slot />` renders by declaring `let:router` on `<Router />` or `<Route />` components (see below).

If you're building an SPA or simply want to leverage on hash-based routing for certain components try the following:

```html
<Route path="#g/:gistId/*filePath" let:router>
  <p>Info: {JSON.stringify(router.params)}</p>
</Route>
```

Standard anchors and `<Link />` components will work as usual:

```html
<a href="#g/1acf21/path/to/README.md">View README.md</a>
```

Declaring a component `<Route path="#" />` will serve as fallback when `location.hash` is empty.

### Nesting

You can render `svero` components inside anything, e.g.

```html
<Router nofallback path="/sub">
  <Route>
    <fieldset>
      <legend>Routing:</legend>
      <Router nofallback path="/sub/:bar">
        <Route let:router>{router.params.bar}!</Route>
      </Router>
      <Route path="/foo">Foo</Route>
      <Route fallback path="*" let:router>
        <summary>
          <p>Not found: {router.params._}</p>
          <details>{router.failure}</details>
        </summary>
      </Route>
      <Router nofallback path="/sub/nested">
        <Route>
          [...]
          <Route fallback path="*">not found?</Route>
          <Route path="/a">A</Route>
          <Route path="/b/:c">C</Route>
          <Route path="/:value" let:router>{JSON.stringify(router.params)}</Route>
        </Route>
      </Router>
    </fieldset>
  </Route>
</Router>
```

Properties determine how routing will match and render routes:

- Use the `nofallback` prop for telling `<Router />` to disable the _fallback_ mechanism by default
- Any route using the `fallback` prop will catch unmatched routes or potential look-up errors
- Use the `exact` prop to skip this route from render just in case it does not matches
- Use `nested` if the route is meant to render the same component on matched segments
- A `<Route />` without `path` will render only if `<Router path="..." />` is active!

> Note that all `<Router />` paths MUST begin from the root as `/sub` and `/sub/nested` in the example.

### Redirects

Sometimes you just want a route to send user to another place. You can use the `redirect` attribute for that.

A redirect should always be a string with a path. It uses the same pattern as `path` attribute. For a redirect to run, there must be a Route with the equivalent path.

```html
<Router>
  <Route path="/company" redirect="/about-us">
  <Route path="/about-us" component={AboutUs}>
</Router>
```

### Conditions

If you need to meet a condition in order to run a route, you can use the `condition` attribute. Conditions can also be used with `redirect` for graceful route fallback.

A condition should be either `boolean` or a function returning `boolean`. There is no support for asynchronous conditions at the moment (so keep it simple).

```html
<Router>
  <Route path="/admin/settings" condition={isAdminLogged} redirect="/admin/login">
</Router>
```

Think of it as a simpler middleware. A condition will run *before* the route loads your component, so there is no wasteful component mounting, and no screen blinking the unwanted view.

### Link Component

There is also an useful `<Link>` component that overrides `<a>` elements:

```html
<Link href="path/here" className="btn">Hello!</Link>
```

The difference between `<Link>` and `<a>` is that it uses `pushState` whenever possible, with fallback to `<a>` behavior. This means that when you use `<Link>`, svero can update the view based on your URL trigger, without reloading the entire page.

> Given `href` values will be normalized (on-click) if they don't start with a slash, e.g. when `location.pathname === '/foo'` then `#bar` would become `/foo#bar` as result.

### navigateTo()

In some cases you want to navigate to routes programatically instead of letting user click on links. For this scenario we have `navigateto()` which takes a route as parameter and navigates imediatelly to said route.

`navigateTo()` receives the same treatment as `<Link>`: It will always try to use `pushState` for better performance, fallbacking to a full page redirect if it isn't supported.

Usage:

```html
<script>
  import { onMount } from 'svelte';
  import { navigateTo } from 'svero';

  onMount(() => {
    if (localStorage.getItem('logged')) {
      navigateTo('/admin');
    }
  });
</script>
```

### Webpack issues

If you're having trouble with Webpack failing to load svero, please replace the following rule (in Svelte rule):

```js
exclude: /node_modules/,
```

with:

```js
exclude: /node_modules\/(?!(svero)\/).*/,
```

More information [here](https://github.com/kazzkiq/svero/issues/23).
