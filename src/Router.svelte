<script>
  import Path from 'path-parser'
  import { writable } from 'svelte/store';
  import { onMount, getContext, setContext } from 'svelte';

  let t;
  let ctx;
  let ctxLoaded = false;
  let currentComponent = null;

  const paths = [];
  const activePath = writable(null);

  function updateComponent(route, params = {}) {
    if (currentComponent && currentComponent.$destroy) {
      currentComponent.$destroy();
      currentComponent = null;
    }

    $activePath = route.path;

    if (!route.component) return;

    currentComponent = new route.component({
      target: ctx,
      props: {
        router: {
          route,
          params
        }
      }
    });
  }

  function gotoRoute(route) {
    history.pushState({}, '', route);

    const popEvent = new Event('popstate');
    window.dispatchEvent(popEvent);
  }

  function handlePopState() {
    paths.some((route) => {
      const browserPath = window.location.pathname;

      // If route matches exactly the url path, load the component
      // and stop the route checking
      if (route.path === browserPath) {
        // If there is no condition and no component, but there is a redirect, simply redirect
        if (!route.condition && !route.component && route.redirect) {
          if (!paths.find(path => path.path === route.redirect)) {
            throw Error(`svero expects <Route redirect="${route.redirect}"> to send to an existing route. ${route.redirect} does not exist.`);
          }

          gotoRoute(route.redirect);
          return true;
        }

        // If there is condition, handle it
        if (route.condition !== undefined && (typeof route.condition === 'boolean' || typeof route.condition === 'function')) {
          if (typeof route.condition === 'boolean' && route.condition) {
            updateComponent(route);
            return true;
          }

          if (typeof route.condition === 'function' && route.condition()) {
            updateComponent(route);
            return true;
          }

          gotoRoute(route.redirect);
          return true;
        }

        updateComponent(route);
        return true;
      }

      // If route includes params, check if it matches with the URL
      // and stop the route checking
      if (route.path.includes(':')) {
        const path = new Path(route.path);
        const result = path.test(browserPath);

        if (result) {
          // If there is no condition, but there is a redirect, simply redirect
          if (!route.condition && route.redirect && paths.filter(path => path.path === route.redirect).length > 0) {
            gotoRoute(route.redirect);
            return true;
          }

          // If there is condition, handle it
          if (route.condition && (typeof route.condition === 'boolean' || typeof route.condition === 'function')) {
            if (typeof route.condition === 'boolean' && route.condition) {
              updateComponent(route, result);
              return true;
            }

            if (typeof route.condition === 'function' && route.condition()) {
              updateComponent(route, result);
              return true;
            }

            gotoRoute(route.redirect);
            return true;
          }

          updateComponent(route, result);
          return true;
        }
      }

      // If route is wildcard (*), fallbacks to the component
      // and stop the route checking
      if (route.path === '*') {
        // If there is no condition, but there is a redirect, simply redirect
        if (!route.condition && route.redirect && paths.filter(path => path.path === route.redirect).length > 0) {
          gotoRoute(route.redirect);
          return true;
        }

        // If there is condition, handle it
        if (route.condition && (typeof route.condition === 'boolean' || typeof route.condition === 'function')) {
          if (typeof route.condition === 'boolean' && route.condition) {
            updateComponent(route);
            return true;
          }

          if (typeof route.condition === 'function' && route.condition()) {
            updateComponent(route);
            return true;
          }

          gotoRoute(route.redirect);
          return true;
        }

        updateComponent(route);
        return true;
      }
    });
  }

  function debouncedHandlePopState() {
    clearTimeout(t);
    t = setTimeout(handlePopState, 100);
  }

  function assignRoute(route) {
    paths.push(route);
    debouncedHandlePopState();
  }

  function unassignRoute(path) {
    const offset = paths.findIndex(route => route.path === path);

    if (offset !== -1) {
      paths.splice(offset, 1);
      debouncedHandlePopState();
    }
  }

  onMount(() => {
    ctx = document.querySelector('[data-svero="ctx"]').parentElement;
    ctxLoaded = true;
    debouncedHandlePopState();
  });

  setContext('__svero__', {
    activePath,
    paths,
    gotoRoute,
    assignRoute,
    updateComponent
  });
</script>

<style>
  .ctx {
    display: none;
  }
</style>

<svelte:window on:popstate={handlePopState}></svelte:window>

{#if !ctxLoaded}
  <div class="ctx" data-svero="ctx"></div>
{/if}

<slot></slot>
