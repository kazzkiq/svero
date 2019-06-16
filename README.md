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

A component loaded by `<Route>` receives a property with route details:

```html
<!-- ./pages/About.svelte -->
<script>
  export let router = {};

  // Those contains useful information about current route status
  router.route; // Route Object
  router.params; // /about/bill/123/kansas { who: 'bill', where: 'kansas' }
</script>
```

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