export const CTX_ROUTER = {};

export function navigateTo(path) {
  // If path empty or no string, throws error
  if (!path || typeof path !== 'string') {
    throw Error(`svero expects navigateTo() to have a string parameter. The parameter provided was: ${path} of type ${typeof path} instead.`);
  }

  if (path[0] !== '/' && path[0] !== '#') {
    throw Error(`svero expects navigateTo() param to start with slash or hash, e.g. "/${path}" or "#${path}" instead of "${path}".`);
  }

  // If no History API support, fallbacks to URL redirect
  if (!history.pushState || !window.dispatchEvent) {
    window.location.href = path;
    return;
  }

  // If has History API support, uses it
  history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}
