/**
 * Frontend configuration.
 * API_URL is injected at container start via envsubst in nginx entrypoint,
 * or defaults to localhost for local development.
 */
window.APP_CONFIG = {
  // Replaced at container start by docker-entrypoint.sh (__API_URL__ placeholder)
  API_URL: '__API_URL__',
};
