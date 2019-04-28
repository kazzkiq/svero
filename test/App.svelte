<script>
  import { Router, Route } from '../build/svero.min';
  import Index from './Index.svelte';
  import About from './About.svelte';
</script>

<Router>
  <Route path="*" component={Index} />
  <Route path="/company" redirect="/about" />
  <Route path="/about" component={About} />
</Router>