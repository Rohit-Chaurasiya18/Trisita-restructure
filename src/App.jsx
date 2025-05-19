import { Provider } from "react-redux";
import store from "./store";
import Routes from "./routes";
import PageLoader from "./components/common/loaders/PageLoader";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location?.pathname]);
  return (
    <Provider store={store}>
      <Routes />
      <PageLoader />
    </Provider>
  );
};
export default App;
