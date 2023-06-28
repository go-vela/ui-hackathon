import { HelmetProvider } from "react-helmet-async";
import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { ComingSoon } from "./components/ComingSoon";
import { Root } from "./components/Root";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { OrgBuilds } from "./pages/OrgBuilds";
import { SourceRepos } from "./pages/SourceRepos";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouteWithHandle } from "./components/Breadcrumbs";
import { Redirector } from "./components/Redirector";
import { UnauthenticatedRoot } from "./components/UnauthenticatedRoot";
import { HeartbeatProvider } from "./library/heartbeat";
import {
  getBuildRoute,
  getOrgRoute,
  getOrgSecretsRoute,
  getOrgSharedSecretsRoute,
  getRepoRoute,
  getRepoSecretsRoute,
} from "./library/routes";
import { AccountAuthenticate } from "./pages/AccountAuthenticate";
import { Home } from "./pages/Home";
import { OrgRepos } from "./pages/OrgRepos";
import { OrgRoot } from "./pages/OrgRoot";
import { OrgSecrets } from "./pages/OrgSecrets";
import { OrgSharedSecrets } from "./pages/OrgSharedSecrets";
import { RepoAudit } from "./pages/RepoAudit";
import { RepoBuild } from "./pages/RepoBuild";
import { RepoBuilds } from "./pages/RepoBuilds";
import { RepoDeployments } from "./pages/RepoDeployments";
import { RepoRoot } from "./pages/RepoRoot";
import { RepoSecrets } from "./pages/RepoSecrets";
import { RepoSettings } from "./pages/RepoSettings";
import { Playground } from "./pages/_Playground";
import { RepoSecretsAdd } from "./pages/RepoSecretsAdd";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/account",
    element: <UnauthenticatedRoot />,
    children: [
      {
        path: "/account/authenticate",
        element: <AccountAuthenticate />,
      },
      {
        path: "/account/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <Root />,
    handle: {
      crumb: () => <Link to="/">Overview</Link>,
    },
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/account/source-repos",
        element: <SourceRepos />,
        handle: {
          crumb: () => <Link to="/account/source-repos">Your repos</Link>,
        },
      },
      {
        path: "/:org",
        element: <OrgRoot />,
        handle: {
          crumb: (a: RouteWithHandle) => {
            return <Link to={getOrgRoute(a.params.org!)}>{a.params.org}</Link>;
          },
        },
        children: [
          {
            path: "/:org",
            element: <OrgRepos />,
            index: true,
          },
          {
            path: "/:org/builds",
            element: <OrgBuilds />,
          },
          {
            path: "/:org/$/secrets/native",
            element: <OrgSecrets />,
          },
          {
            path: "/:org/$/secrets/native/shared/:team",
            element: <OrgSharedSecrets />,
          },
        ],
      },

      // repo
      {
        path: "/:org/:repo",
        element: <RepoRoot />,
        handle: {
          // todo: help make this typesafe
          crumb: (a: RouteWithHandle) => {
            return <Link to={getOrgRoute(a.params.org!)}>{a.params.org}</Link>;
          },
        },
        children: [
          {
            // this has neither index: true nor
            // a specified route
            // so how does any of this work?
            element: (
              <>
                <Outlet />
              </>
            ),
            // index: true,
            handle: {
              crumb: (a: RouteWithHandle) => {
                return (
                  <Link to={getRepoRoute(a.params.org!, a.params.repo!)}>
                    {a.params.repo}
                  </Link>
                );
              },
            },
            children: [
              {
                element: <RepoBuilds />,
                index: true,
              },
              {
                path: "/:org/:repo/:number",
                element: (
                  <>
                    <Outlet />
                  </>
                ),
                handle: {
                  crumb: (a: RouteWithHandle) => {
                    return (
                      <Link
                        to={getBuildRoute(
                          a.params.org!,
                          a.params.repo!,
                          a.params.number!
                        )}
                      >
                        #{a.params.number}
                      </Link>
                    );
                  },
                },
                children: [
                  {
                    index: true,
                    element: <RepoBuild />,
                  },
                  {
                    path: "/:org/:repo/:number/services",
                    element: <ComingSoon />,
                  },
                  {
                    path: "/:org/:repo/:number/pipeline",
                    element: <ComingSoon />,
                  },
                ],
              },
              {
                /**
                 * OK! I know I said I would _NOT_ do this but...
                 * I have good reasons!
                 *
                 * $ is not allowed in either org or repo names
                 *
                 * This way, we can keep the heirachy structure here with the same outlets
                 * without having to re-create the ui in another subtree.
                 *
                 * If you don't like this, that is OK. I understand.
                 *
                 * But for now it makes it easier for me to develop.
                 *
                 * https://github.com/dead-claudia/github-limits#repository-names
                 * https://github.com/dead-claudia/github-limits#organization-names
                 *
                 * Another fun option could be /:org/:repo/(secrets)
                 */
                path: "/:org/:repo/$/secrets/:engine",
                element: <RepoSecrets />,
              },
              {
                path: "/:org/:repo/$/secrets/:engine/add",
                element: <RepoSecretsAdd />,
              },
              {
                path: "/:org/:repo/settings",
                element: <RepoSettings />,
              },
              {
                path: "/:org/:repo/pulls",
                element: <ComingSoon />,
              },
              {
                path: "/:org/:repo/deployments",
                element: <RepoDeployments />,
              },
              {
                path: "/:org/:repo/audit",
                element: <RepoAudit />,
              },
              {
                path: "/:org/:repo/hooks",
                element: (
                  <Redirector>
                    {({ org, repo }) => (
                      <Navigate to={`/${org}/${repo}/audit`} />
                    )}
                  </Redirector>
                ),
              },
              {
                path: "/:org/:repo/:buildNumber/:lineFocus?",
                element: <ComingSoon />,
              },
              {
                path: "/:org/:repo/add-deployment",
                element: <ComingSoon />,
              },
              {
                path: "/:org/:repo/deployment/:deploymentId",
                element: <ComingSoon />,
              },
              {
                path: "/:org/:repo/:buildNumber/services/:lineFocus?",
                element: <ComingSoon />,
              },
              {
                path: "/:org/:repo/:buildNumber/pipeline/:expand?/:lineFocus?",
                element: <ComingSoon />,
              },
            ],
          },
        ],
      },

      {
        path: "/-/secrets/:engine/org/:org",
        // this is an example of how
        // top level redirects can convert into the new better routing pattern
        element: (
          <Redirector>
            {({ org }) => <Navigate to={getOrgSecretsRoute(org)} />}
          </Redirector>
        ),
      },
      {
        path: "/-/secrets/:engine/repo/:org/:repo",
        element: (
          <Redirector>
            {({ org, repo }) => (
              <Navigate to={getRepoSecretsRoute(org, repo)} />
            )}
          </Redirector>
        ),
      },
      {
        path: "/-/secrets/:engine/shared/:org/:team",
        element: (
          <Redirector>
            {({ org, team }) => (
              <Navigate to={getOrgSharedSecretsRoute(org, team)} />
            )}
          </Redirector>
        ),
      },
      {
        path: "/-/secrets/:engine/org/:org/add",
        element: <ComingSoon />,
      },
      {
        path: "/-/secrets/:engine/repo/:org/:repo/add",
        element: <ComingSoon />,
      },
      {
        path: "/-/secrets/:engine/shared/:org/:team/add",
        element: <ComingSoon />,
      },
      {
        path: "/-/secrets/:engine/org/:org/:name",
        element: <ComingSoon />,
      },
      {
        path: "/-/secrets/:engine/repo/:org/:repo/:name",
        element: <ComingSoon />,
      },
      {
        path: "/-/secrets/:engine/shared/:org/:team/:name",
        element: <ComingSoon />,
      },
      {
        path: "/account/settings",
        element: <ComingSoon />,
      },
      {
        path: "/account/logout",
        element: <ComingSoon />,
      },
      {
        path: "/$/playground",
        element: <Playground />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <HeartbeatProvider>
            <ToastPrimitive.Provider swipeDirection="right">
              <RouterProvider router={router} />
              <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[30rem] max-w-[90vw] list-none flex-col gap-2 p-[var(--viewport-padding)] outline-none [--viewport-padding:1.5rem] " />
            </ToastPrimitive.Provider>
          </HeartbeatProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
