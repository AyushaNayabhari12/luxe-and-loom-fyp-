import { Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import './App.css';

import DashboardLayout from './components/dashboard/layout/Layout';
import ProtectedRoutes from './components/routes-protection/ProtectedRoutes';
import MainLayout from './components/shared/MainLayout';
import AboutUsPage from './pages/AboutUsPage';
import ChangePasswordPage from './pages/auth/ChangePassword';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import UserProfile from './pages/auth/UserProfile';
import UserVerificationPage from './pages/auth/UserVerificationPage';
import Dashboard from './pages/dashboard/Dashboard';
import AllOrderList from './pages/dashboard/order/AllOrderList';
import ProductForm from './pages/dashboard/product/ProductForm';
import ProductsList from './pages/dashboard/product/ProductList';
import UsersList from './pages/dashboard/UsersList';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFoundPage';
import CartPage from './pages/shop/CartPage';
import ProductDetailsPage from './pages/shop/ProductDetailsPage';
import Shop from './pages/shop/Shop';
import UserOrderList from './pages/shop/UserOrdersList';
import PaymentSuccess from './pages/shop/PaymentSuccessPage';
import ShawlCustomizer from './pages/Customization';

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
          <Route path='/verify-email' element={<UserVerificationPage />} />

          <Route path='/' element={<HomePage />} />

          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
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
            <Route path='/about' element={<AboutUsPage />} />

            <Route path='/customize' element={<ShawlCustomizer />} />

            <Route path='/shop'>
              <Route index element={<Shop />} />
              <Route path=':id' element={<ProductDetailsPage />} />
              <Route path='orders' element={<UserOrderList />} />

              <Route path='cart' element={<CartPage />} />

              <Route path='checkout' element={<PaymentSuccess />} />
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

/**
 * const shawls = [
  {
    id: 'shawl1',
    name: 'Classic Pashmina',
    baseImage: 'https://www.transparenttextures.com/patterns/white-wall-3.png',
    dimensions: { width: 400, height: 400 },
  },
];

const patterns = [
  {
    id: 'pattern1',
    name: 'Floral Pattern 1',
    image: 'https://www.transparenttextures.com/patterns/arabesque.png',
  },
  {
    id: 'pattern2',
    name: 'Geometric Pattern 2',
    image: 'https://www.transparenttextures.com/patterns/black-twill.png',
  },

 */
