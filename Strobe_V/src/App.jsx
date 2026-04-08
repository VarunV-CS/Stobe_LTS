import "./App.css";
import MainLayout from "./layouts/MainLayout";
import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

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
  

];

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
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
