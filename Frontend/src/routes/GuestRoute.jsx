import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';

export default function GuestRoute() {
    const { user } = useSelector(selectAuth);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
