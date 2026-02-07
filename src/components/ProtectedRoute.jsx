import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        const role = localStorage.getItem('role');
        if (role !== requiredRole) {
            return <Navigate to="/products" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
