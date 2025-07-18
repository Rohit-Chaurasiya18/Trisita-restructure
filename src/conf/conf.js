const conf = {
  APIUrl: String(import.meta.env.VITE_REACT_APP_API_URL),
  googleApiKey: String(import.meta.env.VITE_GOOGLE_MAP_API),
  cookiePath: String(import.meta.env.VITE_REACT_APP_COOKIE_PATH),
  cookieDomain: String(import.meta.env.VITE_REACT_APP_COOKIE_DOMAIN),
  cookieExpires: String(import.meta.env.VITE_REACT_APP_COOKIE_EXPIRES),
};
export default conf;
