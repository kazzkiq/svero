<script>
  import { onMount, onDestroy, getContext } from 'svelte';

  const { assignRoute, unassignRoute, routeInfo } = getContext('__svero__');

  export let key = null;
  export let path = '';
  export let props = null;
  export let exact = undefined;
  export let fallback = undefined;
  export let component = undefined;
  export let condition = undefined;
  export let redirect = undefined;

  let ctx;
  let ctxLoaded;
  let fullpath;
  let current;

  function add(info, exported) {
    if (ctx && info && component) {
      if (current && current.__proto__.constructor === component) return;

      const { props: _props, ..._others } = $$props;

      // prune all declared props from this component
      exported.forEach(k => {
        delete _others[k];
      });

      current = new component({
        target: ctx,
        props: {
          ..._props,
          ..._others,
          router: info,
        },
      });
    }

    if (!info && component) {
      if (current && current.$destroy) {
        current.$destroy();
        current = null;
      }
    }
  }

  $: router = $routeInfo[key];
  $: add(router, arguments[0]['$$'].props);

  onMount(() => {
    [key, fullpath] = assignRoute(key, path, { condition, redirect, fallback, exact });
    ctx = document.querySelector('[data-svero="ctx"]').parentElement;
    ctxLoaded = true;
  });

  onDestroy(() => {
    unassignRoute(fullpath);
  });
</script>

<style>
  .ctx {
    display: none;
  }
</style>

{#if !ctxLoaded}
  <div class="ctx" data-svero="ctx"></div>
{/if}

{#if router && !component}
  <slot {router} />
{/if}
