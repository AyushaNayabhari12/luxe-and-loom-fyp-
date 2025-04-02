import { Navigate, Outlet, useLocation } from 'react-router';
import { toast } from 'sonner';
import { getAuthTokenFromCookie } from '../../utils/cookieHandler';

const ProtectedRoutes = () => {
  const { pathname } = useLocation();

  const authRoutes = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
  ];

  // Public routes (can be accessed without being logged in)
  const publicRoutes = ['/', ...authRoutes];

  const authTokenFromCookie = getAuthTokenFromCookie();

  if (!authTokenFromCookie && !publicRoutes.includes(pathname)) {
    return <Navigate to='/sign-in' replace />;
  }

  if (authTokenFromCookie && authRoutes.includes(pathname)) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;

