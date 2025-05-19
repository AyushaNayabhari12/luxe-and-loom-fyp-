import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import * as fabric from "fabric";
import React, { useEffect, useRef, useState } from "react";
import { useKhalti } from "../khalti/useKhalti.js";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext.js";
import { v4 as uuid } from "uuid";
import { SIZES } from "../config/index.js";
import AddToCartDialog from "../components/shop/AddToCartDialog.jsx";

const patterns = ["/pattern1.webp"];

const shawlImages = [
  "/shawl2.webp",
  "/shawl3.webp",
  "/shawl4.webp",
  "/shawl7.webp",
  "/shawl9.webp",
  "/shawl10.webp",
];

const ShawlCustomizer = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [selectedShawl, setSelectedShawl] = useState(shawlImages[0]);
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState(0);

  const {
    initiate,
    initiationError,
    isLoading: isKhaltiLoading,
  } = useKhalti({
    onSuccess: () => {
      navigate("/shop");
    },
    onError: (error) => {
      toast.error("Unable to checkout at the moment, please try again later.");
      console.error("Payment error:", error.message);
    },
  });

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("canvas", {
      height: 500,
      width: 700,
      backgroundColor: "#fff",
    });

    setCanvas(fabricCanvas);
    loadShawlImage(fabricCanvas, selectedShawl);

    fabricCanvas.on("selection:created", updateTextColorFromSelection);
    fabricCanvas.on("selection:updated", updateTextColorFromSelection);
    fabricCanvas.on("selection:cleared", () => setTextColor("#000000"));

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      loadShawlImage(canvas, selectedShawl);
    }
  }, [selectedShawl]);

  const handlePayment = () => {
    if (!currentUser?.deliveryAddress) {
      toast.error("Please update your delivery address in profile page");
      return;
    }

    if (!size || quantity < 1) {
      toast.error("Please select size,and valid quantity.");
      return;
    }

    localStorage.setItem(
      "customizedShawlOrder",
      JSON.stringify({
        size,
        quantity,
        customizedImage: convertCanvasToImage(),
      }),
    );

    const oderId = uuid();

    const paymentRequest = {
      amount: 1200 * quantity * 100, // Convert NPR to paisa
      purchase_order_id: oderId,
      purchase_order_name: `order-${oderId}`,
      customer_info: {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phoneNumber,
      },
      return_url: `${window.location.origin}/shop/checkout`,
      website_url: window.location.origin,
    };

    initiate(paymentRequest);
  };

  const loadShawlImage = (fabricCanvas, src) => {
    if (!src) return;

    const imgEl = document.createElement("img");
    imgEl.src = src;

    imgEl.onload = function () {
      const img = new fabric.Image(imgEl);

      const canvasWidth = fabricCanvas.width;
      const canvasHeight = fabricCanvas.height;
      const imgWidth = imgEl.width;
      const imgHeight = imgEl.height;

      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - imgWidth * scale) / 2, // center horizontally
        top: (canvasHeight - imgHeight * scale) / 2, // center vertically
        selectable: false,
        evented: false,
        objectType: "shawl",
      });

      const existingShawl = fabricCanvas
        .getObjects()
        .find((obj) => obj.objectType === "shawl");

      if (existingShawl) fabricCanvas.remove(existingShawl);

      img.set({ objectType: "shawl" });
      fabricCanvas.add(img);
      // fabricCanvas.sendToBack(img);
    };
  };

  const updateTextColorFromSelection = (e) => {
    const active = e.selected?.[0] || canvas?.getActiveObject();
    if (active && active.type === "text") {
      setTextColor(active.fill);
    }
  };

  const addPattern = (src) => {
    const imgEl = document.createElement("img");
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
        objectType: "pattern",
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
      objectType: "text",
    });
    canvas.add(text);
    canvas.bringToFront(text);
    setTextInput("");
  };

  const deleteSelected = () => {
    const active = canvas.getActiveObject();
    if (active) canvas.remove(active);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setTextColor(newColor);

    const active = canvas.getActiveObject();
    if (active && active.type === "text") {
      active.set("fill", newColor);
      canvas.renderAll();
    }
  };

  const convertCanvasToImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png", // or 'jpeg'
      quality: 1,
    });

    return dataURL;
  };

  const downloadCanvasAsImage = () => {
    const dataURL = convertCanvasToImage();

    if (!dataURL) return;

    const link = document.createElement("a");
    link.href = dataURL;
    link.download =
      Math.floor(Math.random() * 123456789) + "_customized_shawl.png";
    link.click();
  };

  const toggleOpen = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="p-10">
      <Typography variant="h4" className="text-center mb-2">
        Customize
      </Typography>
      <Typography className="text-center text-gray-600 mb-8">
        Review your customized shawl, adjust options, and proceed to checkout
        from the cart page.
      </Typography>

      <div className="flex flex-col md:flex-row gap-6 p-20">
        <div className="flex justify-center">
          <canvas id="canvas" ref={canvasRef}></canvas>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <Typography variant="h6">Choose Shawl</Typography>
          <div className="flex gap-3">
            {shawlImages.map((shawl) => (
              <img
                key={shawl}
                src={shawl}
                alt={shawl}
                onClick={() => setSelectedShawl(shawl)}
                className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer ${
                  selectedShawl === shawl
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>

          <Typography variant="h6">Choose Pattern</Typography>
          <div className="flex gap-3 flex-wrap">
            {patterns.map((p) => (
              <img
                key={p}
                src={p}
                alt={p}
                className="w-20 h-20 cursor-pointer border border-gray-200 hover:border-black rounded-md object-cover"
                onClick={() => addPattern(p)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Input
              label="Enter text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              color="gray"
            />

            <input
              type="color"
              value={textColor}
              onChange={handleColorChange}
              className="w-[80px] h-full border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              onClick={addText}
              color="blue"
              fullWidth
              className="rounded-md"
            >
              Add Text
            </Button>

            <Button
              onClick={deleteSelected}
              color="red"
              fullWidth
              className="rounded-md"
            >
              Delete Selected
            </Button>

            <Button
              onClick={downloadCanvasAsImage}
              color="blue-gray"
              fullWidth
              className="rounded-md"
            >
              Download Design
            </Button>

            <Button onClick={toggleOpen} color="green">
              Buy Now
            </Button>

            <AddToCartDialog
              isCustomization
              convertCanvasToImage={convertCanvasToImage}
            />
          </div>
        </div>
      </div>

      <Dialog open={openModal} handler={toggleOpen} size="md">
        <DialogHeader>Order Now</DialogHeader>

        <DialogBody className="space-y-5">
          {/* Size */}
          <div>
            {initiationError && <Alert color="red">{initiationError}</Alert>}

            <Select
              label="Select Size"
              value={size}
              onChange={(val) => setSize(val)}
            >
              {SIZES?.map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
        </DialogBody>

        <DialogFooter className="flex gap-3">
          <Button variant="outlined" onClick={toggleOpen}>
            Cancel
          </Button>
          <Button onClick={handlePayment} loading={isKhaltiLoading}>
            Place Order
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ShawlCustomizer;
