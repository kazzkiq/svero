<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { navigateTo } from './utils';

  export let href = '/';

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

<a {href} {...$$props} on:click|preventDefault={onClick}>
  <slot></slot>
</a>