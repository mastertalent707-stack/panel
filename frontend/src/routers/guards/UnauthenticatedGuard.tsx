import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/providers/AuthProvider.tsx';

export default function UnauthenticatedGuard() {
  const { user } = useAuth();

  if (user) {
    const redirect = sessionStorage.getItem('post-login-redirect');
    if (redirect) {
      sessionStorage.removeItem('post-login-redirect');
      return <Navigate to={redirect} />;
    }
    return <Navigate to='/' />;
  }

  return <Outlet />;
}
