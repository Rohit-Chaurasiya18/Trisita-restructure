import { Suspense } from "react";
import Layout from "@/layout";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import routesConfig from "./routes.config";
import _404 from "@/components/common/_404";
import routesConstants from "./routesConstants";
import Loader from "@/components/common/loaders/Loader";
import {
  Route,
  Routes as ReactRouterDomRoutes,
  Navigate,
} from "react-router-dom";
import Cookies from "@/services/cookies";

const Common = (route) => (
  <Suspense fallback={<Loader />}>
    <route.component />
  </Suspense>
);

Common.prototype = {
  component: PropTypes.elementType.isRequired,
};

const Public = (route) => {
  return (
    <Suspense fallback={<Loader />}>
      <route.component />
    </Suspense>
  );
};

Public.prototype = {
  ...Common.prototype,
};

const Private = (route) => {
  const { component: Component } = route;
  const { userDetail, user } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
    user: state?.profile?.userDetail,
  }));

  // Check role access
  const hasAccess = route?.roles?.includes(userDetail?.user_type);

  if (!hasAccess) {
    return <Navigate to={routesConstants?.DASHBOARD} replace />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

Private.prototype = {
  ...Common.prototype,
};

const createNestedRoutes = (routes, RouteType) => {
  return routes.map((route, i) => {
    if (!route.component) {
      throw new Error("Component must be required....");
    }
    if (route.children) {
      return (
        <Route path={route.path} key={i} element={<RouteType {...route} />}>
          {createNestedRoutes(route.children, RouteType)}
        </Route>
      );
    } else {
      return (
        <Route
          key={i}
          index={route.index}
          path={route.path}
          element={<RouteType {...route} />}
        />
      );
    }
  });
};

const Routes = () => {
  const { isAuth, user } = useSelector((state) => ({
    isAuth: state?.login?.isAuth,
    user: state?.profile?.userDetail,
  }));
  const { common, private: privateRoutes, public: publicRoutes } = routesConfig;
  
  const generateRoute = (arr, ids) => {
    function filterRoutesByModuleId(routes, allowedIds) {
      return routes
        .map((route) => {
          // filter children recursively (if any)
          const children = route.children
            ? filterRoutesByModuleId(route.children, allowedIds)
            : undefined;

          // check if this route should be included
          const include =
            route.moduleId === undefined ||
            allowedIds?.includes(route.moduleId);

          if (!include) return null;

          return {
            ...route,
            ...(children ? { children } : {}),
          };
        })
        .filter(Boolean); // remove nulls
    }

    // usage
    const filteredPrivateRoutes = filterRoutesByModuleId(arr, ids);
    return filteredPrivateRoutes;
  };

  const filteredPrivateRoutes = generateRoute(
    privateRoutes,
    Cookies.get("user")?.module_assigned_id
  );

  return (
    <ReactRouterDomRoutes>
      {isAuth ? (
        <>
          <Route
            index
            path="/"
            element={<Navigate to={routesConstants?.DASHBOARD} />}
          />
          <Route path="/" element={<Layout />}>
            {createNestedRoutes(filteredPrivateRoutes, Private)}
          </Route>
          <Route
            path="*"
            element={<Navigate to={routesConstants?.DASHBOARD} />}
          />
        </>
      ) : (
        <>
          <Route
            index
            path="/"
            element={<Navigate to={routesConstants.LOGIN} />}
          />
          {createNestedRoutes(publicRoutes, Public)}
          <Route path="*" element={<Navigate to={routesConstants.LOGIN} />} />
        </>
      )}

      {createNestedRoutes(common, Common)}
    </ReactRouterDomRoutes>
  );
};

export default Routes;
