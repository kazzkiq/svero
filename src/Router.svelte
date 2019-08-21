<script context="module">
  import Router from 'abstract-nested-router';
  import { CTX_ROUTER, navigateTo } from './utils';

  const router = new Router();
</script>

<script>
  import { writable } from 'svelte/store';
  import { onMount, getContext, setContext } from 'svelte';

  let t;
  let failure;
  let fallback;

  export let path = '/';
  export let nofallback = null;

  const routeInfo = writable({});
  const routerContext = getContext(CTX_ROUTER);
  const basePath = routerContext ? routerContext.basePath : writable(path);

  function cleanPath(route) {
    return route.replace(/\?[^#]*/, '').replace(/(?!^)\/#/, '#').replace('/#', '#').replace(/\/$/, '');
  }

  function fixPath(route) {
    if (route === '/#*' || route === '#*') return '#*_';
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
    $routeInfo[fallback] = { failure: e, params: { _: path.substr(1) || undefined } };
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

    //this if statement will handle for electron apps using the file instead of http.
    //svero won't work like this..
    
    if(location.href.includes("file")) { 
       //If is a file then do something different.
      //Only use hash tags routes can be done different let me know.

        const fullpath = cleanPath(`/${location.href.split('index.html').slice(1).join('/').replace(".", "")}`);

          //Fix if returns empty string...
        fullpath = (fullpath) ? fullpath : cleanPath(`/${location.href.split('/').slice(3).join('/')}`);
    
    }else {//This is else if server through web server..
      const fullpath = cleanPath(`/${location.href.split('/').slice(3).join('/')}`);
      
   }
   

    try {
      const found = resolveRoutes(fullpath);

      if (fullpath.includes('#')) {
        const next = router.find(fullpath);
        const keys = {};

        // override previous routes to avoid non-exact matches
        handleRoutes(found.concat(next).reduce((prev, cur) => {
          if (typeof keys[cur.key] === 'undefined') {
            keys[cur.key] = prev.length;
          }

          prev[keys[cur.key]] = cur;

          return prev;
        }, []));
      }
    } catch (e) {
      if (!fallback) {
        failure = e;
        return;
      }

      doFallback(e, fullpath);
    }
  }

  function _handlePopState() {
    clearTimeout(t);
    t = setTimeout(handlePopState, 100);
  }

  function assignRoute(key, route, detail) {
    key = key || Math.random().toString(36).substr(2);

    const fixedRoot = $basePath !== path && $basePath !== '/'
      ? `${$basePath}${path}`
      : path;

    const handler = { key, ...detail };

    let fullpath;

    router.mount(fixedRoot, () => {
      fullpath = router.add(fixPath(route), handler);
      fallback = (handler.fallback && key) || fallback;
    });

    _handlePopState();

    return [key, fullpath];
  }

  function unassignRoute(route) {
    router.rm(fixPath(route));
    _handlePopState();
  }

  setContext(CTX_ROUTER, {
    basePath,
    routeInfo,
    assignRoute,
    unassignRoute,
  });
</script>

<svelte:window on:popstate={handlePopState}></svelte:window>

{#if failure && !nofallback}
  <fieldset>
    <legend>Router failure: {path}</legend>
    <pre>{failure}</pre>
  </fieldset>
{/if}

<slot />
