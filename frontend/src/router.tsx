import { Outlet, Router, Route, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Layout from "./components/Layout.tsx";
import Index from "./pages/Index.tsx";
import Step1 from "./pages/registration/Step1.tsx";
import Step2 from "./pages/registration/Step2.tsx";

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

const step1Route = new Route({
  getParentRoute: () => rootRoute,
  path: "/registration/step1",
  component: Step1,
});

const step2Route = new Route({
  getParentRoute: () => rootRoute,
  path: "/registration/step2",
  component: Step2,
});

// Add routes to the route tree here
const routeTree = rootRoute.addChildren([
  error404Route,
  indexRoute,
  step1Route,
  step2Route,
]);

const router = new Router({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export default router;
