import { Button } from '@material-tailwind/react';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { postRequest } from '../../utils/apiHandler';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setError('');
      setLoading(true);

      const res = await postRequest({
        endpoint: '/auth/forgot-password',
        data: { email },
      });

      if (res.ok) {
        toast.success('Forgot password link sent to your email');
        setEmail('');
        return;
      }

      setError(res.message || 'An error occurred. Please try again.');
    } catch (err) {
      console.log(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Reset your password'
      subtitle='Enter your email to receive a reset link'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {error && (
          <div className='bg-red-50 text-red-800 rounded-md p-3 text-sm'>
            {error}
          </div>
        )}

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
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
              placeholder='Enter your email'
            />
          </div>
        </div>

        <div>
          <Button loading={loading} type='submit' className='w-full'>
            Forgot Password
          </Button>
        </div>

        <div className='text-sm text-center'>
          Remember your password?{' '}
          <Link
            to='/sign-in'
            className='font-medium text-gray-900 hover:text-gray-700'>
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

