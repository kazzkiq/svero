<script>
  import { Router, Route, Link } from '../src/main';
  import Index from './Index.svelte';
  import About from './About.svelte';
  import User from './User.svelte';
</script>

<main>
  <Router>
    <Route fallback path="*"><h1>Not found</h1></Route>
    <Route exact path="/" component={Index} />
    <Route path="/company" redirect="/about" />
    <Route path="/about" component={About} />
    <Route path="/user/:name/:age" component={User} />
    <Route path="/admin-false" condition={false} component={User} redirect="/" />
    <Route path="/admin-true" condition={true} component={User} redirect="/" />
    <Route path="/slot"><h3>It works!</h3></Route>
    <Router nofallback path="/nested">
      <Route>
        <a href="#abc/def/ghi">Show params</a> | <Link href="#test">Static test</Link> | <Link href="#">Reset hash</Link>
        <p>
          <Route path="#:any/*path" let:router>Params: {JSON.stringify(router.params)}</Route>
          <Route path="#test">Static placeholder is shown</Route>
          <Route path="#">No hash is present</Route>
          <Route path="*"><h1>O.K.</h1></Route>
        </p>
      </Route>
    </Router>
    <Route path="#*" let:router>
      <p><b>Anchored</b>. {router.params._}</p>
    </Route>
  </Router>
</main>
