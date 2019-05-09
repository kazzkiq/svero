<script>
  import { onMount } from 'svelte';
  import { navigateTo } from './utils';
  let cssClass = '';
  export let href = '/';
  export let className = '';
  export { cssClass as class };

  onMount(() => {
    className = className || cssClass;
  });
</script>

<a href={href} class={className} on:click|preventDefault={() => navigateTo(href)}><slot></slot></a>