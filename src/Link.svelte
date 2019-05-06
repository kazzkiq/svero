<script>
  import { navigateTo } from './utils';
  export let href = '/';
  export let className = '';
</script>

<a href={href} class={className} on:click|preventDefault={() => navigateTo(href)}><slot></slot></a>