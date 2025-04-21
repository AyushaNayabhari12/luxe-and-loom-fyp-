import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { postRequest } from '../../utils/apiHandler';
import { toast } from 'sonner';
import { Button } from '@material-tailwind/react';

export function SignUp() {
  const defaultAuthInfo = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNum: '',
  };

  const [authInfo, setAuthInfo] = useState(defaultAuthInfo);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setError('');

      if (authInfo.password !== authInfo.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);

      const res = await postRequest({
        endpoint: '/auth/sign-up',
        data: authInfo,
      });

      if (res.ok) {
        toast.success('Account created successfully');
        navigate('/sign-in');
        return;
      }

      setError(res.message || 'An error occurred. Please try again.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAuthInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <AuthLayout
      title='Create your account'
      subtitle='Join Shwal Shops today'
      isSignUp>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {error && (
          <div className='bg-red-50 text-red-800 rounded-md p-3 text-sm'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-2 gap-x-5 gap-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'>
              Full name
            </label>
            <div className='mt-1'>
              <input
                id='name'
                name='name'
                type='text'
                autoComplete='name'
                required
                value={authInfo.name}
                onChange={handleChange}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                placeholder='Enter your name'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'>
              Email address
            </label>
            <div className='mt-1'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={authInfo.email}
                onChange={handleChange}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                placeholder='Enter your email'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='address'
              className='block text-sm font-medium text-gray-700'>
              Address
            </label>
            <div className='mt-1'>
              <input
                id='address'
                name='address'
                type='address'
                autoComplete='address'
                required
                value={authInfo.address}
                onChange={handleChange}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                placeholder='Enter your address'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='phoneNum'
              className='block text-sm font-medium text-gray-700'>
              Phone Number
            </label>
            <div className='mt-1'>
              <input
                id='phoneNum'
                name='phoneNum'
                type='phoneNum'
                autoComplete='phoneNum'
                required
                value={authInfo.phoneNum}
                onChange={handleChange}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                placeholder='Enter your phone number'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='mt-1'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                value={authInfo.password}
                onChange={handleChange}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                placeholder='Enter your password'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'>
              Confirm Password
            </label>
            <div className='mt-1'>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                required
                value={authInfo.confirmPassword}
                onChange={handleChange}
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                placeholder='Enter your confirm password'
              />
            </div>
          </div>
        </div>

        <div>
          <Button loading={loading} type='submit' className='w-full'>
            Sign In
          </Button>
        </div>

        <div className='text-sm text-center'>
          Already have an account?{' '}
          <Link
            to='/sign-in'
            className='font-medium text-gray-900 hover:text-gray-700'>
            Sign Up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

