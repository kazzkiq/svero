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

  $: router = $routeInfo[key];

  $: if (!router && component) {
    if (current && current.$destroy) {
      current.$destroy();
      current = null;
    }
  }

  $: if (ctx && router && component) {
    const { props: _props, ..._obj } = $$props;

    // prune all declared props from this component
    arguments[0]['$$'].props.forEach(k => {
      delete _obj[k];
    });

    current = new component({
      target: ctx,
      props: {
        ..._props,
        ..._obj,
        router,
      },
    });
  }

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
