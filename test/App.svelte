<script>
  import { Router, Route } from '../build/svero.min';
  import Index from './Index.svelte';
  import About from './About.svelte';
  import User from './User.svelte';
</script>

<main>
  <Router>
    <Route path="*" redirect="/about" />
    <Route path="/" component={Index} />
    <Route path="/company" redirect="/about" />
    <Route path="/about" component={About} />
    <Route path="/user/:name" component={User} />
    <Route path="/user/:name/:age" component={User} />
    <Route path="/admin-false" condition={false} component={User} redirect="/" />
    <Route path="/admin-true" condition={true} component={User} redirect="/" />
    <Route path="/slot"><h3>It works!</h3></Route>
  </Router>
</main>
