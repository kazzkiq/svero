<script>
  import { onMount, onDestroy, getContext } from 'svelte';

  const { assignRoute, unassignRoute, routeInfo } = getContext('__svero__');

  export let key = null;
  export let path = '';
  export let exact = undefined;
  export let fallback = undefined;
  export let component = undefined;
  export let condition = undefined;
  export let redirect = undefined;

  let fullpath;

  $: router = $routeInfo[key];

  onMount(() => {
    [key, fullpath] = assignRoute(key, path, { condition, redirect, fallback, exact });
  });

  onDestroy(() => {
    unassignRoute(fullpath);
  });
</script>

{#if router}
  {#if component}
    <svelte:component this={component} {router} />
  {:else}
    <slot {router} />
  {/if}
{/if}
