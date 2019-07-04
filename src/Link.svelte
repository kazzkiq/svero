<script>
  import { onMount } from 'svelte';
  import { navigateTo } from './utils';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let cssClass = '';
  export let href = '/';
  export let className = '';
  export let title = '';
  export { cssClass as class };

  onMount(() => {
    className = className || cssClass;
  });
  
  function onClick() {
      dispatch('click');
      navigateTo(href);
  }
</script>

<a href={href} class={className} on:click|preventDefault={onClick}><slot></slot></a>
