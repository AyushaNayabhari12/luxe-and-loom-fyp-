import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { SERVER_URL } from '../../config';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '@material-tailwind/react';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setError('');

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);

      const res = await fetch(`${SERVER_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success('Password Reset Successfully');
        setConfirmPassword('');
        setPassword('');
        navigate('/sign-in');
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
      title='Set new password'
      subtitle='Enter your new password below'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {error && (
          <div className='bg-red-50 text-red-800 rounded-md p-3 text-sm'>
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'>
            New password
          </label>
          <div className='mt-1'>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='new-password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700'>
            Confirm new password
          </label>
          <div className='mt-1'>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              autoComplete='new-password'
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm'
            />
          </div>
        </div>

        <div>
          <Button loading={loading} type='submit' className='w-full'>
            Reset Password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

