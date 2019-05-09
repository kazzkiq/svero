<script>
  import { Link, navigateTo } from '../build/svero.min';

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

{#if router.params.name === 'Classious'}
  <Link class="purple" href="/about">Go to About</Link>
{:else}
  <Link className="red" href="/about">Go to About</Link>
{/if}
<br>
<button on:click={() => { navigateTo('/about') }}>Goto /about</button>
<br>
<em on:click={() => { navigateTo('') }}>Does nothing</em>
<br>
<strong on:click={() => { navigateTo('about') }}>Does nothing</strong>
<br>
<Link href="/test-no-class">No Class Link</Link>