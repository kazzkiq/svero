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

  function doFallback(e, path) {
    $routeInfo[fallback] = { failure: e, params: { _: path.substr(1) } };
  }

  function resolveRoutes(path) {
    const segments = path.split('#')[0].split('/');
    const prefix = [];
    const map = [];

    segments.forEach(key => {
      const sub = prefix.concat(`/${key}`).join('');

      if (key) prefix.push(`/${key}`);

      try {
        const next = router.find(sub);

        handleRoutes(next);
        map.push(...next);
      } catch (e_) {
        doFallback(e_, path);
      }
    });

    return map;
  }

  function handlePopState() {
    const fullpath = `/${location.href.split('/').slice(3).join('/')}`.replace(/(?!^)\/#/, '#').replace(/\/$/, '');

    try {
      const found = resolveRoutes(fullpath);

      if (fullpath.includes('#')) {
        handleRoutes(found.concat(router.find(fullpath)));
      }
    } catch (e) {
      if (!fallback) {
        failure = e;
        return;
      }

      doFallback(e, fullpath);
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
