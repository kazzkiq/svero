[![npm version](https://badge.fury.io/js/svero.svg)](https://www.npmjs.com/package/svero)

<p align="center">
  svero (<b>Sve</b>lte <b>Ro</b>uter): A simple router for Svelte 3.
</p>


## Usage

The usage is as simple as this:

```html
<script>
  import { Router, Route } from 'svero';

  import Index from './pages/Index.html';
  import About from './pages/About.html';
</script>

<Router>
  <Route path="*" component={Index} />
  <Route path="/about" component={About} />
  <Route path="/about/:who/123/:where" component={About} />
</Router>
```

The `*` wildcard here simply means fallback. If a route fails to meet any other path, it then loads the path with the `*`, if it exists.

Paths with parameters (`:param`) are passed to components via `props.router.params`.

A component loaded by a `<Route>` receives a property with route details:

```html
<script>
  export const router = {};

  // Those contains useful information about current route status
  router.route;
  router.params;
</script>
```

There is also an useful `<Link>` component that overrides `<a>` elements:

```html
<Link href="path/here" className="btn">Hello!</Link>
```