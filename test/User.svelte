<script>
  import { Link } from '../build/svero.min';

  export let router = {};
</script>

{#if router.params.age}
  <h1>Hello {router.params.name}, {router.params.age}yo!</h1>
{:else}
  <h1>Hello {router.params.name}!</h1>
{/if}

{#if window.location.pathname === '/admin-true'}
  <h2>Admin Panel</h2>
{/if}

<Link className="red" href="/about">Go to About</Link>