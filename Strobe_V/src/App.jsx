import "./App.css";
import MainLayout from "./layouts/MainLayout";
import { Routes, Route, matchPath, useLocation } from "react-router";
import { lazy, Suspense, useEffect } from "react";

import Login from "./pages/login";
import { RootLayout } from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Candidates = lazy(() => import("./pages/Candidates"));
const Profile = lazy(() => import("./pages/Profile"));
const CreateCandidate = lazy(() => import("./pages/CreateCandidate"));
const EditCandidate = lazy(() => import("./pages/EditCandidate"));
const ClientRoles = lazy(() => import("./pages/ClientRoles"));
const Template = lazy(() => import("./pages/Template"));
const Roles = lazy(() => import("./pages/Roles"));
const CreateRoles = lazy(() => import("./pages/CreateRoles"));
const EditRoles = lazy(() => import("./pages/EditRoles"));

const routes = [
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/candidates", element: <Candidates /> },
  { path: "/profile", element: <Profile /> },
  { path: "/candidates/create", element: <CreateCandidate /> },
  { path: "/candidates/:id", element: <EditCandidate /> },
  { path: "/ClientRoles", element: <ClientRoles /> },
  { path: "/Template", element: <Template /> },
  { path: "/roles", element: <Roles /> },
  { path: "/roles/create", element: <CreateRoles /> },
  { path: "/roles/:id", element: <EditRoles /> },
];

const pageTitles = [
  { path: "/", title: "Login" },
  { path: "/dashboard", title: "Dashboard" },
  { path: "/candidates", title: "Candidates" },
  { path: "/candidates/create", title: "Create Candidate" },
  { path: "/candidates/:id", title: "Edit Candidate" },
  { path: "/profile", title: "Profile" },
  { path: "/ClientRoles", title: "Client Roles" },
  { path: "/Template", title: "Template" },
  { path: "/roles", title: "Roles" },
  { path: "/roles/create", title: "Create Role" },
  { path: "/roles/:id", title: "Edit Role" },
];

function useDynamicPageTitle() {
  const location = useLocation();

  useEffect(() => {
    const activePage = pageTitles.find((page) =>
      matchPath({ path: page.path, end: true }, location.pathname)
    );
    const baseTitle = "Strobe";
    document.title = activePage ? `${activePage.title} | ${baseTitle}` : baseTitle;
  }, [location.pathname]);
}

function App() {
  useDynamicPageTitle();

  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            {routes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <RootLayout>{element}</RootLayout>
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Routes>
      </MainLayout>
    </>
  );
}

export default App;
