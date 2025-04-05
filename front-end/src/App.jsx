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
import HomePage from './pages/HomePage';
import MainLayout from './components/shared/MainLayout';
import PageNotFound from './pages/PageNotFoundPage';
import Shop from './pages/shop/Shop';
import ProductDetailsPage from './pages/shop/ProductDetailsPage';
import CartPage from './pages/shop/CartPage';
import UserProfile from './pages/auth/UserProfile';
import UserOrderList from './pages/shop/UserOrdersList';
import AllOrderList from './pages/dashboard/order/AllOrderList';

function App() {
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          <Route path='/' element={<HomePage />} />

          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<div>Dashboard</div>} />
            <Route path='users' element={<UsersList />} />

            <Route path='products'>
              <Route index element={<ProductsList />} />
              <Route path='add' element={<ProductForm />} />
              <Route path='edit/:id' element={<ProductForm />} />
            </Route>

            <Route path='orders' element={<AllOrderList />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path='/my-profile' element={<UserProfile />} />
            <Route path='/change-password' element={<ChangePasswordPage />} />

            <Route path='/shop'>
              <Route index element={<Shop />} />
              <Route path=':id' element={<ProductDetailsPage />} />
              <Route path='orders' element={<UserOrderList />} />

              <Route path='cart' element={<CartPage />} />
            </Route>

            <Route path='*' element={<PageNotFound />} />
          </Route>

          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

