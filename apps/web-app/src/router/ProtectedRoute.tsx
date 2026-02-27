import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Currently we handle email verification at the login stage in the backend (it returns 403 error).
    // But if the token is valid, we can assume the user is verified.
    // If we want to strictly handle "logged in but not verified" on the frontend, we'd need IsEmailVerified in UserData.
    // For now, if they have a user object, they are allowed in, because login blocks unverified users.

    return <Outlet />;
};
