import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import {
  Input,
  Button,
  Typography,
  Select,
  Option,
  Card,
} from '@material-tailwind/react';

const patterns = [
  { id: 1, name: 'Floral', src: '/floral.png' },
  { id: 2, name: 'Geometric', src: '/geometric.png' },
  { id: 3, name: 'Argyle', src: '/argyle.png' },
];

const shawlImages = [
  { label: 'Shawl 1', value: '/shawl-1.png' },
  { label: 'Shawl 2', value: '/shawl-2.png' },
  { label: 'Shawl 3', value: '/shawl-3.png' },
];

const ShawlCustomizer = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedShawl, setSelectedShawl] = useState(shawlImages[0].value);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas('canvas', {
      height: 500,
      width: 700,
      backgroundColor: '#fff',
    });

    setCanvas(fabricCanvas);
    loadShawlImage(fabricCanvas, selectedShawl);

    fabricCanvas.on('selection:created', updateTextColorFromSelection);
    fabricCanvas.on('selection:updated', updateTextColorFromSelection);
    fabricCanvas.on('selection:cleared', () => setTextColor('#000000'));

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      loadShawlImage(canvas, selectedShawl);
    }
  }, [selectedShawl]);

  const loadShawlImage = (fabricCanvas, src) => {
    const imgEl = document.createElement('img');
    imgEl.src = src;

    imgEl.onload = function () {
      const img = new fabric.Image(imgEl);
      img.set({
        selectable: false,
        evented: false,
        scaleX: fabricCanvas.width / imgEl.width,
        scaleY: fabricCanvas.height / imgEl.height,
        left: 0,
        top: 0,
      });

      const existingShawl = fabricCanvas
        .getObjects()
        .find(obj => obj.objectType === 'shawl');
      if (existingShawl) fabricCanvas.remove(existingShawl);

      img.set({ objectType: 'shawl' });
      fabricCanvas.add(img);
      fabricCanvas.sendToBack(img);
    };
  };

  const updateTextColorFromSelection = e => {
    const active = e.selected?.[0] || canvas?.getActiveObject();
    if (active && active.type === 'text') {
      setTextColor(active.fill);
    }
  };

  const addPattern = src => {
    const imgEl = document.createElement('img');
    imgEl.src = src;

    imgEl.onload = function () {
      const img = new fabric.Image(imgEl);
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        hasBorders: true,
        hasControls: true,
        objectType: 'pattern',
      });
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
    };
  };

  const addText = () => {
    const text = new fabric.Text(textInput, {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: textColor,
      objectType: 'text',
    });
    canvas.add(text);
    canvas.bringToFront(text);
    setTextInput('');
  };

  const deleteSelected = () => {
    const active = canvas.getActiveObject();
    if (active) canvas.remove(active);
  };

  const handleColorChange = e => {
    const newColor = e.target.value;
    setTextColor(newColor);

    const active = canvas.getActiveObject();
    if (active && active.type === 'text') {
      active.set('fill', newColor);
      canvas.renderAll();
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-6 p-6'>
      <div className='flex justify-center'>
        <canvas id='canvas' ref={canvasRef}></canvas>
      </div>

      <div className='flex flex-col gap-4 w-full max-w-md'>
        <Typography variant='h6'>Choose Shawl</Typography>
        <div className='flex gap-3'>
          {shawlImages.map(shawl => (
            <img
              key={shawl.value}
              src={shawl.value}
              alt={shawl.label}
              onClick={() => setSelectedShawl(shawl.value)}
              className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer ${
                selectedShawl === shawl.value
                  ? 'border-blue-600'
                  : 'border-gray-200'
              }`}
            />
          ))}
        </div>

        <Typography variant='h6'>Choose Pattern</Typography>
        <div className='flex gap-3 flex-wrap'>
          {patterns.map(p => (
            <img
              key={p.id}
              src={p.src}
              alt={p.name}
              className='w-20 h-20 cursor-pointer border border-gray-200 hover:border-black rounded-md object-cover'
              onClick={() => addPattern(p.src)}
            />
          ))}
        </div>

        <div className='flex items-center gap-3'>
          <Input
            label='Enter text'
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            color='gray'
          />

          <input
            type='color'
            value={textColor}
            onChange={handleColorChange}
            className='w-[80px] h-full border rounded'
          />
        </div>

        <Button onClick={addText} color='blue'>
          Add Text
        </Button>
        <Button onClick={deleteSelected} color='red'>
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default ShawlCustomizer;


