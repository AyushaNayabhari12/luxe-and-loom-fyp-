import { Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import './App.css';

import DashboardLayout from './components/dashboard/layout/Layout';
import ProtectedRoutes from './components/routes-protection/ProtectedRoutes';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import UsersList from './pages/dashboard/UsersList';
import ProductForm from './pages/dashboard/product/ProductForm';
import ProductsList from './pages/dashboard/product/ProductList';
import ChangePasswordPage from './pages/auth/ChangePassword';

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
          <Route path='/change-password' element={<ChangePasswordPage />} />

          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<div>Dashboard</div>} />
            <Route path='users' element={<UsersList />} />

            <Route path='products'>
              <Route index element={<ProductsList />} />
              <Route path='add' element={<ProductForm />} />
              <Route path='edit/:id' element={<ProductForm />} />
            </Route>

            <Route path='orders' element={<div>orders</div>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;


