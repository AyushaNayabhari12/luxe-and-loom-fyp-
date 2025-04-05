import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  CardHeader,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import { formatImageUrl } from '../../utils';
import { patchRequest } from '../../utils/apiHandler';
import { toast } from 'sonner';

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useAuthContext();

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    phoneNum: '',
    deliveryAddress: '',
    profileImage: '',
    profileImageFile: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      handleChange({
        target: {
          name: 'profileImageFile',
          value: file,
        },
      });
    }
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();

      const formData = new FormData();

      Object.keys(userInfo).forEach(key => {
        formData.append(key, userInfo[key]);
      });

      setError('');
      setLoading(true);

      const res = await patchRequest({
        endpoint: `/users/${currentUser._id}`,
        data: formData,
      });

      if (res.ok) {
        toast.success(res.message);
        setCurrentUser(res.data);
        return;
      }

      setError(res.message || 'An error occurred. Please try again.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUserInfo(currentUser);
    }
  }, [currentUser]);

  return (
    <div className='bg-gray-100 p-20 flex justify-center items-center'>
      <div>
        <div className='text-center mb-8'>
          <Typography variant='h4'>Edit Profile</Typography>
          <Typography color='gray' className='text-sm'>
            Update your profile information
          </Typography>
        </div>

        <Card className='w-[700px]'>
          <CardBody>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {error && (
                <div className='bg-red-50 text-red-800 rounded-md p-3 text-sm'>
                  {error}
                </div>
              )}

              {/* Profile Image Section */}
              <div className='flex flex-col items-center'>
                <img
                  src={formatImageUrl(
                    userInfo.profileImageFile || userInfo.profileImage
                  )}
                  alt='Profile'
                  className='w-24 h-24 rounded-full object-cover border mb-2'
                />
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </div>

              {/* Input Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Input
                  label='Full Name'
                  name='name'
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label='Email'
                  name='email'
                  type='email'
                  value={userInfo.email}
                  onChange={handleChange}
                  required
                  readOnly
                />
                <Input
                  label='Phone Number'
                  name='phoneNum'
                  value={userInfo.phoneNum}
                  onChange={handleChange}
                  required
                />
                <Input
                  label='Address'
                  name='address'
                  value={userInfo.address}
                  onChange={handleChange}
                  required
                />
                <Input
                  label='Delivery Address'
                  name='deliveryAddress'
                  value={userInfo.deliveryAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  className='bg-gray-900 hover:bg-gray-800'
                  loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;

