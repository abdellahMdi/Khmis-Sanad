import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';

export default function ProtectedRoute({ roles }) {
    const location = useLocation();
    const { user, role, status } = useSelector(selectAuth);

    if (status === 'loading') {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (roles?.length && !roles.includes(role)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
