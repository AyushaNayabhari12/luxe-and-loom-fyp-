import { Route, Router, Routes } from 'react-router';
import './App.css';
import { Toaster } from 'sonner';

import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import ProtectedRoutes from './components/routes-protection/ProtectedRoutes';
import DashboardLayout from './components/dashboard/layout/Layout';

function App() {
  return (
    <div>
      <Toaster theme='dark' />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<div>Hello World</div>} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<div>Dashboard</div>} />
            <Route path='users' element={<div>Users</div>} />
            <Route path='products' element={<div>products</div>} />
            <Route path='orders' element={<div>orders</div>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;







