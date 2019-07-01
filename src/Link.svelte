<script>
  import { onMount } from 'svelte';
  import { navigateTo } from './utils';
  let cssClass = '';
  export let href = '/';
  export let className = '';
  export let title = '';
  export { cssClass as class };

  onMount(() => {
    className = className || cssClass;
  });
</script>

<a href={href} class={className} title={title} on:click|preventDefault={() => navigateTo(href)}><slot></slot></a>
