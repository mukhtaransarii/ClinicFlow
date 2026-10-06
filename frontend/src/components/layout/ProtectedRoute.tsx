import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/stores/authStore";
export default function ProtectedRoute() {
    const { user, initialized } = useAuthStore();
    const location = useLocation();
    if (!initialized)
        return <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">Loading clinic...</div>;
    if (!user)
        return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
    return <Outlet />;
}

