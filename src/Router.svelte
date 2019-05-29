<script context="module">
  import Router from 'abstract-nested-router';
  import { navigateTo } from './utils';

  const router = new Router();
</script>

<script>
  import { writable } from 'svelte/store';
  import { onMount, getContext, setContext } from 'svelte';

  let t;
  let ctx;
  let failure;
  let fallback;
  let ctxLoaded = false;

  export let path = '/';
  export let nofallback = null;

  const routeInfo = writable({});

  function fixPath(route) {
    if (route === '/#*' || route === '#*') return '/#*_';
    if (route === '/*' || route === '*') return '/*_';
    return route;
  }

  function handleRoutes(map) {
    const params = map.reduce((prev, cur) => {
      prev[cur.key] = Object.assign(prev[cur.key] || {}, cur.params);
      return prev;
    }, {});

    let skip;
    let routes = {};

    map.some(x => {
      if (typeof x.condition === 'boolean' || typeof x.condition === 'function') {
        const ok = typeof x.condition === 'function' ? x.condition() : x.condition;

        if (ok === false && x.redirect) {
          navigateTo(x.redirect);
          skip = true;
          return true;
        }
      }

      if (x.key && !routes[x.key]) {
        if (x.exact && !x.matches) return false;
        routes[x.key] = { ...x, params: params[x.key] };
      }

      return false;
    });

    if (!skip) {
      $routeInfo = routes;
    }
  }

  function handlePopState() {
    const fullpath = `/${location.href.split('/').slice(3).join('/')}`.replace(/(?!^)\/#/, '#').replace(/\/$/, '');

    try {
      const base = router.find(fullpath.split('#')[0]);
      const full = router.find(fullpath);

      handleRoutes(base.concat(full));
    } catch (e) {
      if (!fallback) {
        failure = e;
        return;
      }

      $routeInfo = { [fallback]: { failure: e, params: { _: fullpath.substr(1) } } };
    }
  }

  function debouncedHandlePopState() {
    clearTimeout(t);
    t = setTimeout(handlePopState, 100);
  }

  function assignRoute(key, route, routeInfo) {
    key = key || Math.random().toString(36).substr(2);

    const handler = { key, ...routeInfo };

    let fullpath;

    router.mount(path, () => {
      fullpath = router.add(fixPath(route), handler);
      fallback = (handler.fallback && key) || fallback;
    });

    debouncedHandlePopState();

    return [key, fullpath];
  }

  function unassignRoute(route) {
    router.mount(path, () => {
      router.rm(fixPath(route));
    });

    debouncedHandlePopState();
  }

  onMount(() => {
    ctx = document.querySelector('[data-svero="ctx"]').parentElement;
    ctxLoaded = true;
    debouncedHandlePopState();
  });

  setContext('__svero__', {
    routeInfo,
    assignRoute,
    unassignRoute,
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

{#if failure && !nofallback}
  <fieldset>
    <legend>Router failure: {path}</legend>
    <pre>{failure}</pre>
  </fieldset>
{/if}

<slot />
