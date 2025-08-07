import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RoleRoute } from "./features/auth/utils/RoleRoute";
import { Layout } from "./features/auth/utils/layout";
import NotFound from "./features/pages/NotFound";

import Dashboard from "./features/pages/Dashboard";
import Customers from "./features/pages/Customers";
import PackageInfo from "./features/pages/PackageInfo";
import AuthPage from "./features/pages/AuthPage";

import { AuthGuard } from "./features/auth/utils/AuthGuard";
import { AuthProvider } from "./features/auth/utils/AuthProvider";
import CalendarPage from "./features/pages/Calendar";
import FirebaseDataLoader from "./services/FirebaseDataLoader";
import Notes from "./features/pages/Notes";
import Needs from "./features/pages/Needs";
import Employees from "./features/pages/Employees";
import NewUserPage from "./features/pages/NewUserPage";
import { StrictAuthRedirector } from "./features/auth/utils/StrictAuthRedirector";
import CustomerPayment from "./features/pages/CustomerPayment";
function App() {

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        //StrictAuthRedirector for preventing accessing Auth page if it's authenticated
        <StrictAuthRedirector>
          <AuthPage className="pageView" />
        </StrictAuthRedirector>
      ),
    },
    // !#########################################################################
    {
      path: "/newuser",
      // element: <UnauthorizedRedirect className="pageView" />,
      element: <NewUserPage />,
    },
    {
      path: "/unauthorized",
      // element: <UnauthorizedRedirect className="pageView" />,
      element: <NotFound />,
    },
    {
      path: "*",
      element: <NotFound />, // Catches unmatched nested routes
    },
    // !#########################################################################
    {
      path: "/",
      element: (
        <AuthGuard>
          <Layout className="h-[100%] bg-[red]" />
        </AuthGuard>
      ),

      children: [
        {
          path: "/dashboard",

          element: (
            <RoleRoute allowedRoles={[705]}>
              <FirebaseDataLoader>
                <Dashboard />
              </FirebaseDataLoader>
              {/* <Dashboard className="pageView" /> */}
            </RoleRoute>
          ),
          // loader: prepareData,
        },
        {
          path: "/manager-dashboard",

          element: (
            <RoleRoute allowedRoles={[531]}>
              <h1>Manager Dashboard</h1>
            </RoleRoute>
          ),
          // loader: prepareData,
        },
        {
          path: "/calendar",
          element: (
            // allowed for all users
            <RoleRoute>
              <CalendarPage className="pageView" />
            </RoleRoute>
          ),
          // loader: prepareData,
        },
        {
          path: "/customers",
          element: (
            // allowed for all users
            <RoleRoute>
              <Customers className="pageView" />
            </RoleRoute>
          ),
          // loader: prepareData,
          // shouldRevalidate: ({ currentUrl }) => {
          //   // Add any custom revalidation logic here
          //   return true;
          // },
        },

        {
          path: "/packages",
          element: (
            <RoleRoute allowedRoles={[705, 493]}>
              <PackageInfo className="pageView" />
            </RoleRoute>
          ),
          // loader: prepareData,
        },

        {
          path: "/needs",
          element: (
            // allowed for all users
            <RoleRoute>
              <Needs />
            </RoleRoute>
          ),
          // loader: prepareData,
        },
        {
          path: "/notes",
          element: (
            // allowed for all users
            <RoleRoute>
              <Notes className="pageView" />
            </RoleRoute>
          ),
          // loader: prepareData,
        },
        {
          path: "/customer/:id",
          element: (
            // allowed for all users
            <RoleRoute>
              <CustomerPayment className="pageView" />
            </RoleRoute>
          ),
          // loader: prepareData,
        },
        {
          path: "/employees",
          element: (
            // allowed for all users
            <RoleRoute allowedRoles={[705]}>
              <Employees className="pageView" />
            </RoleRoute>
          ),
          // loader: prepareData,
        },
      ],
    },
  ]);

  return (
    // authProvider for verifying Tokens
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
