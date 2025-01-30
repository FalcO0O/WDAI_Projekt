import { Navigate, useLocation } from "react-router-dom";

export const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
    const userRole = localStorage.getItem("userRole");

    if (!isLoggedIn || userRole !== 'admin') {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

