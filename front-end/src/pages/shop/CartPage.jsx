import {
  Alert,
  Button,
  Card,
  CardBody,
  IconButton,
  Input,
  Textarea,
  Typography,
} from '@material-tailwind/react';
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatImageUrl } from '../../utils';
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from '../../utils/apiHandler';
import { useQuery } from '@tanstack/react-query';
import useAuthContext from '../../hooks/useAuthContext';
import { toast } from 'sonner';
import { MdArticle } from 'react-icons/md';

const CartPage = () => {
  const { currentUser } = useAuthContext();
  const [order, setOrder] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [displayNoteTextBox, setDisplayNoteTextBox] = useState(false);

  const [loading, setLoading] = useState(false);
  const [cartCheckoutLoading, setCartCheckoutLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['Cart Items'],
    queryFn: async ({ queryKey }) => {
      try {
        const [_searchText, _role] = queryKey;

        const res = await getRequest({
          endpoint: '/orders/cart',
        });

        setOrder(res?.data);

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  const handleQuantity = (type, id, quantity = null) => {
    setOrder(prevOrder => {
      return {
        ...prevOrder,
        orderItems: prevOrder.orderItems.map(item => {
          if (item._id !== id) return item;

          if (
            type === 'input' &&
            quantity > 0 &&
            quantity < item.product.stock
          ) {
            return {
              ...item,
              quantity,
            };
          }

          if (type === 'inc' && item.quantity < item.product.stock) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          if (type === 'dec' && item.quantity > 1)
            return {
              ...item,
              quantity: item.quantity - 1,
            };

          return item;
        }),
      };
    });
  };

  const deleteCartItem = async id => {
    try {
      const res = await deleteRequest({
        endpoint: `/orders/cart/${id}`,
      });

      if (res.ok) {
        toast.success(res.message);

        setOrder(prevOrder => {
          return {
            ...prevOrder,
            orderItems: prevOrder.orderItems.filter(el => {
              return el._id !== id;
            }),
          };
        });

        return;
      }

      toast.error(res.message || 'An error occurred. Please try again.');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const updateCartItemsQuantity = async () => {
    try {
      let isSuccess = true;

      setLoading(true);

      for (const orderItem of order.orderItems) {
        const res = await patchRequest({
          endpoint: `/orders/cart/${orderItem._id}`,
          data: {
            quantity: orderItem.quantity,
          },
        });

        if (!res.ok) {
          isSuccess = false;
          break;
        }
      }

      if (isSuccess) {
        toast.success('Cart Items updated');
        return;
      }

      toast.error('An error occurred. Please try again.');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkoutCart = async () => {
    try {

      if(!deliveryAddress){
        toast.error("Please enter delivery address")
        return;
      }

      setCartCheckoutLoading(true);

      const res = await postRequest({
        endpoint: '/orders/cart/checkout',
        data: {
          notes,
          deliveryAddress,
        },
      });

      if (res.ok) {
        toast.success(
          'Order Placed Successfully. Please check your email for more details.'
        );
        setOrder(null)
        return;
      }

      toast.error(res.message || 'An error occurred. Please try again.');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setCartCheckoutLoading(false);
    }
  };

  const toggleDisplayNoteTextBook = () => setDisplayNoteTextBox(prev => !prev);

  useEffect(() => {
    if (currentUser?.deliveryAddress) {
      setDeliveryAddress(currentUser.deliveryAddress);
    }
  }, [currentUser]);

  if (isLoading) {
    return <div className=' bg-gray-100 p-20'>Fetching data...</div>;
  }

  return (
    <div className=' bg-gray-100 p-20'>
      <Typography variant='h4' className='text-center mb-2'>
        My Cart
      </Typography>
      <Typography className='text-center text-gray-600 mb-8'>
        Review your items, adjust quantities, and proceed to checkout on our
        cart page
      </Typography>

      {!order || order?.orderItems?.length === 0 ? (
        <div>
          <Alert color='blue'> No Items in the cart </Alert>{' '}
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Section */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Product Card */}
            {order?.orderItems?.map(item => {
              const { _id, size, color, quantity, product } = item;
              return (
                <Card shadow={true} className='p-0 m-0'>
                  <CardBody className='flex flex-col lg:flex-row gap-6 items-center justify-between p-3'>
                    <img
                      src={formatImageUrl(product.images[0])}
                      alt={product.name}
                      className='w-28 h-28 object-cover rounded-md'
                    />
                    <div className='flex-1 space-y-2'>
                      <Typography variant='h6'>HUBA Venom Jacket</Typography>
                      <Typography className='text-gray-700 font-semibold'></Typography>

                      <div className='text-sm text-gray-600'>
                        <p>Price: NPR {product.basePrice}</p>
                        <p>Size: {color}</p>
                        <p>Color: {size}</p>
                      </div>
                    </div>

                    <div className='relative w-[150px]'>
                      <Input
                        type='number'
                        value={quantity}
                        onChange={e =>
                          handleQuantity('input', _id, Number(e.target.value))
                        }
                        className='!border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100  focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        labelProps={{
                          className: 'before:content-none after:content-none',
                        }}
                        containerProps={{
                          className: 'min-w-0',
                        }}
                        min={1}
                      />
                      <div className='absolute right-1 top-1 flex gap-0.5'>
                        <IconButton
                          size='sm'
                          className='rounded'
                          onClick={() => handleQuantity('dec', _id)}>
                          <MinusIcon />
                        </IconButton>

                        <IconButton
                          size='sm'
                          className='rounded'
                          onClick={() => {
                            handleQuantity('inc', _id);
                          }}>
                          <PlusIcon />
                        </IconButton>
                      </div>
                    </div>

                    <div className='flex items-center gap-4'>
                      <Typography variant='paragraph' className='font-semibold'>
                        NPR {(product.basePrice * quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        variant='text'
                        color='red'
                        onClick={() => {
                          deleteCartItem(_id);
                        }}>
                        <Trash2Icon />
                      </IconButton>
                    </div>
                  </CardBody>
                </Card>
              );
            })}

            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <button
                    className='flex gap-x-2 items-center'
                    onClick={toggleDisplayNoteTextBook}>
                    <MdArticle /> <span className='text-sm'>ADD NOTES</span>
                  </button>
                </div>

                <div>
                  <Button
                    variant='outlined'
                    loading={loading}
                    onClick={updateCartItemsQuantity}>
                    Update Cart
                  </Button>
                </div>
              </div>

              {displayNoteTextBox && (
                <div className='h-[100px] w-[340px]'>
                  <Textarea
                    label='Extra Notes'
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card shadow={true}>
              <CardBody className='space-y-4'>
                <Typography variant='h6'>Order summary</Typography>
                <div className='flex justify-between text-sm'>
                  <span>Subtotal</span>
                  <span>NRP {order?.total}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Delivery</span>
                  <span className='text-green-500'>FREE</span>
                </div>

                <Textarea
                  label='Delivery Address'
                  value={deliveryAddress}
                  onChange={e => {
                    setDeliveryAddress(e.target.value);
                  }}
                />

                <hr />
                <div className='flex justify-between font-semibold'>
                  <span>Total</span>
                  <span>NRP {order?.total}</span>
                </div>

                <Button
                  fullWidth
                  className='bg-gray-900 hover:bg-gray-800'
                  onClick={checkoutCart}
                  loading={cartCheckoutLoading}>
                  Checkout
                </Button>

                <div className='text-center text-xs text-gray-500 mt-1'>
                  🔒 Secure Checkout
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

