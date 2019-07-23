<script>
  export let description = '';
  export let router = null;
</script>

<h1>Hello from About!</h1>

{#if description}
  <p>{description}</p>
{/if}
