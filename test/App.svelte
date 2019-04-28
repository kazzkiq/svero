<script>
  import { Router, Route } from '../build/svero.min';
  import Index from './Index.svelte';
</script>

<Router>
  <Route path="*" component={Index} />
</Router>