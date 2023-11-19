import { Outlet, Router, Route, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Layout from "./components/Layout/Layout.tsx";
import Index from "./pages/Index.tsx";
import QuestionForm from "./pages/Registration.tsx";
import { Login } from "./pages/Login.tsx";
import Jobs from "./pages/Jobs.tsx";
import Checkout from "./pages/Checkout.tsx";

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});

// Create new routes here
const error404Route = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <h1>404</h1>, //TODO: Make it pretty! (Also define as a component in pages dir)
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const jobsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: Jobs,
});

const checkoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const registrationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: QuestionForm,
});

// Add routes to the route tree here
const routeTree = rootRoute.addChildren([
  error404Route,
  indexRoute,
  loginRoute,
  registrationRoute,
  jobsRoute,
  checkoutRoute,
]);

const router = new Router({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export default router;
