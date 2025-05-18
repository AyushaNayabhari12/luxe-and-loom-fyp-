import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Tooltip,
} from '@material-tailwind/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { postRequest } from '../../utils/apiHandler.js';
import { COLORS, SIZES } from '../../config/index.js';

const AddToCartDialog = ({
  product = {},
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartDetails, setCartDetails] = useState({
    productId: product?._id || '',
    size: '',
    color: '',
    quantity: 1,
    customizedImage: '',
  });

  const toggleOpen = () => setOpen(!open);

  const handleColorToggle = color => {
    setCartDetails(prev => ({
      ...prev,
      color: prev.color === color ? '' : color,
    }));
  };

  const handleSizeChange = size => {
    setCartDetails(prev => ({
      ...prev,
      size,
    }));
  };

  const handleQuantityChange = e => {
    setCartDetails(prev => ({
      ...prev,
      quantity: parseInt(e.target.value) || 1,
    }));
  };



  const handleSubmit = async () => {
    try {
      if (!cartDetails.size || cartDetails.quantity < 1) {
        toast.error('Please select size,and valid quantity.');
        return;
      }

      if (!cartDetails.color) {
        toast.error('Please select a color.');
        return;
      }

      if ( cartDetails.quantity > product.stock) {
        toast.error('Entered quantity exceeds available stock.');
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append('productId', cartDetails.productId);
      formData.append('size', cartDetails.size);
      formData.append('color', cartDetails.color);
      formData.append('quantity', cartDetails.quantity);

      const res = await postRequest({
        endpoint: '/orders/cart',
        data: formData,
      });

      if (res.ok) {
        toast.success('Item added to cart!');
        toggleOpen();
      } else {
        toast.error(res.message || 'Failed to add to cart.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const { sizes = SIZES, colors = COLORS } = product;

  return (
    <>
      <Button onClick={toggleOpen}>Add to Cart</Button>

      <Dialog open={open} handler={toggleOpen} size='md'>
        <DialogHeader>Add Product to Cart</DialogHeader>

        <DialogBody className='space-y-5'>
          {/* Size */}
          <div>
            <Select
              label='Select Size'
              value={cartDetails.size}
              onChange={handleSizeChange}>
              {sizes?.map(size => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Input
              label='Quantity'
              type='number'
              min={1}
              value={cartDetails.quantity}
              onChange={handleQuantityChange}
            />
          </div>

          {/* Color */}
            <div className='flex gap-x-5 mt-4'>
              <div>
                <div className='grid grid-cols-9 gap-6'>
                  {colors?.map((color, index) => (
                    <Tooltip key={index} content={color} placement='top'>
                      <div
                        className={`w-10  h-10 rounded border cursor-pointer ${
                          cartDetails.color === color ? 'ring-2 ring-black' : ''
                        }`}
                        title={color}
                        onClick={() => handleColorToggle(color)}
                        style={{
                          backgroundColor: color.toLowerCase(),
                        }}></div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
        </DialogBody>

        <DialogFooter className='flex gap-3'>
          <Button variant='outlined' onClick={toggleOpen}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddToCartDialog;

