<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { navigateTo } from './utils';

  let cssClass = '';

  export let href = '/';
  export let className = '';
  export let title = '';
  export { cssClass as class };

  onMount(() => {
    className = className || cssClass;
  });

  const dispatch = createEventDispatcher();

  // this will enable `<Link on:click={...} />` calls
  function onClick(e) {
    let fixedHref = href;

    // this will rebase anchors to avoid location changes
    if (fixedHref.charAt() !== '/') {
      fixedHref = window.location.pathname + fixedHref;
    }

    navigateTo(fixedHref);
    dispatch('click', e);
  }
</script>

<a {href} class={className} on:click|preventDefault={onClick}><slot></slot></a>
