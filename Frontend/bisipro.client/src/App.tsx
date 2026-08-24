import { BrowserRouter,Navigate,  Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/authContext";
import { MainLayout } from "./layouts/MainLayout";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const GroupsPage = lazy(() => import("./pages/GroupsPage"));
const GroupMemberPage = lazy(() => import("./pages/GroupMemberPage"));
const GroupMemberDetails = lazy(() => import("./pages/GroupMemberDetails"));

function App() {

    return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/group/members" element={<GroupMemberPage />} />
                <Route path="/group/members/:userId" element={<GroupMemberDetails />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
    );
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

        <p className="mt-4 text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  );
}


export default App;
