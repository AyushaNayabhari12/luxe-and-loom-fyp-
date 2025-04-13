import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import useAuthContext from '../../hooks/useAuthContext';
import { formatImageUrl } from '../../utils';

const DraggableWrapper = ({ children }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable bounds='parent' nodeRef={nodeRef}>
      <div ref={nodeRef} className='absolute top-0 left-0 cursor-move'>
        {children}
      </div>
    </Draggable>
  );
};

const TryOn = ({ images = [] }) => {
  const { currentUser } = useAuthContext();

  const [userImage, setUserImage] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [shawlSize, setShawlSize] = useState(120);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(URL.createObjectURL(file));
    }
  };

  const increaseSize = () => {
    setShawlSize(prevSize => Math.min(prevSize + 10, 300));
  };

  const decreaseSize = () => {
    setShawlSize(prevSize => Math.max(prevSize - 10, 50));
  };

  useEffect(() => {
    if (currentUser?.profileImage) {
      setUserImage(formatImageUrl(currentUser?.profileImage));
    }
  }, [currentUser]);

  return (
    <>
      <Button onClick={handleOpen} variant='outlined' className='mr-5'>
        Try On
      </Button>

      <Dialog open={open} handler={handleOpen} size='lg'>
        <DialogBody>
          <div className='flex gap-x-10'>
            {userImage && (
              <div className='relative w-[50%] h-[500px] border rounded overflow-hidden'>
                <img
                  src={userImage}
                  alt='User'
                  className='w-full h-full object-cover'
                />
                {selectedOverlay && (
                  <DraggableWrapper>
                    <img
                      src={formatImageUrl(selectedOverlay)}
                      alt='Shawl'
                      className='pointer-events-none bg-transparent'
                      style={{ width: `${shawlSize}px`, background: 'none' }}
                      draggable={false}
                    />
                  </DraggableWrapper>
                )}
              </div>
            )}

            <div>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='mb-4'
              />

              {selectedOverlay && (
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={decreaseSize}
                    className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'>
                    - Resize
                  </button>
                  <button
                    onClick={increaseSize}
                    className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'>
                    + Resize
                  </button>
                </div>
              )}

              <div className='grid grid-cols-4 gap-4 mt-5'>
                {images.map((shawl, index) => (
                  <img
                    key={index}
                    src={formatImageUrl(shawl)}
                    alt={`shawl-${index}`}
                    onClick={() => {
                      setSelectedOverlay(shawl);
                      setShawlSize(120);
                    }}
                    className='w-20 h-20 border rounded cursor-pointer hover:border-black bg-transparent'
                    style={{ background: 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className='pt-0'>
          <Button variant='gradient' color='red' onClick={handleOpen}>
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default TryOn;

