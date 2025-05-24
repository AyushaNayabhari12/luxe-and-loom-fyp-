import {
  Button,
  Carousel,
  Input,
  Option,
  Select,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { COLORS, PRODUCT_CATEGORIES, SIZES } from "../../../config";
import { FaCirclePlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../../utils/apiHandler";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { formatImageUrl } from "../../../utils";

const ProductFrom = () => {
  const { id } = useParams();
  const isEdit = !!id;

  const defaultProductInfo = {
    name: "",
    description: "",
    basePrice: "",
    stock: "",
    category: "",
    images: [],
    deletedImages: [],
    sizes: [],
    colors: [],
  };

  const imageInputElRef = useRef(null);

  const [productInfo, setProductInfo] = useState(defaultProductInfo);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: existingProduct } = useQuery({
    queryKey: ["PRODUCT_BY_ID"],
    queryFn: async () => {
      try {
        const res = await getRequest({
          endpoint: `/products/${id}`,
        });

        return res?.data || [];
      } catch (error) {
        return {};
      }
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && existingProduct) {
      setProductInfo((prev) => ({
        ...prev,
        ...existingProduct,
        deletedImages: [],
      }));
    }
  }, [isEdit, existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorToggle = (color) => {
    setProductInfo((prev) => {
      return {
        ...prev,
        colors: prev.colors.includes(color)
          ? prev.colors.filter((c) => c !== color)
          : [...prev.colors, color],
      };
    });
  };

  const handleSizeToggle = (size) => {
    setProductInfo((prev) => {
      return {
        ...prev,
        sizes: prev.sizes.includes(size)
          ? prev.sizes.filter((c) => c !== size)
          : [...prev.sizes, size],
      };
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!productInfo.images.length) {
        toast.error("Please upload at least one image.");
        return;
      }

      if (!productInfo.category) {
        toast.error("Please select a category.");
        return;
      }

      if (!productInfo.colors.length) {
        toast.error("Please select at least one color.");
        return;
      }

      if (!productInfo.sizes.length) {
        toast.error("Please select at least one size.");
        return;
      }

      setError("");
      setLoading(true);

      const formData = new FormData();

      Object.keys(productInfo).forEach((key) => {
        if (key === "images") {
          productInfo.images.forEach((image) => {
            if (typeof image === "object") {
              formData.append("newImages", image);
            } else {
              formData.append("images", image);
            }
          });
        } else if (key === "deletedImages") {
          productInfo.deletedImages.forEach((image) => {
            if (typeof image === "string") {
              formData.append("deletedImages", image);
            }
          });
        } else if (key === "colors") {
          productInfo.colors.forEach((color) => {
            formData.append("colors", color);
          });
        } else if (key === "sizes") {
          productInfo.sizes.forEach((size) => {
            formData.append("sizes", size);
          });
        } else {
          formData.append(key, productInfo[key]);
        }
      });

      const res = isEdit
        ? await patchRequest({
            endpoint: `/products/${productInfo._id}`,
            data: formData,
          })
        : await postRequest({
            endpoint: "/products",
            data: formData,
          });

      if (res.ok) {
        toast.success(res.message);
        navigate("/dashboard/products");
        setProductInfo(defaultProductInfo);
        return;
      }

      setError(res.message || "An error occurred. Please try again.");
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {isEdit ? "Update" : "Add"} Product
      </h1>

      <form
        className="mt-4 grid grid-cols-2 gap-y-8 gap-x-5"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 bg-white p-3 rounded-md">
          {error && (
            <div className="bg-red-50 text-red-800 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          <p className="font-bold">Product Information</p>

          <Input
            type="text"
            label="Product Name"
            name="name"
            onChange={handleChange}
            value={productInfo.name}
            required
          />

          <Input
            type="number"
            min={200}
            max={20000}
            step={0.01}
            label="Base Price"
            name="basePrice"
            onChange={handleChange}
            value={productInfo.basePrice}
            required
          />

          <Input
            type="number"
            min="1"
            label="Stock"
            name="stock"
            onChange={handleChange}
            value={productInfo.stock}
            required
          />

          <Select
            label="Category"
            onChange={(value) => {
              handleChange({ target: { name: "category", value } });
            }}
            value={productInfo.category}
          >
            {PRODUCT_CATEGORIES.map((category, index) => (
              <Option key={index} value={category}>
                {category}
              </Option>
            ))}
          </Select>

          <Textarea
            label="Description"
            name="description"
            onChange={handleChange}
            value={productInfo.description}
            required
          />

          <div>
            <p className="font-bold">Sizes</p>

            <div className="flex gap-5 mt-2">
              {SIZES.map((size, index) => (
                <div
                  className={`px-3 py-2 rounded border cursor-pointer ${
                    productInfo.sizes.includes(size)
                      ? "bg-green-300"
                      : "bg-gray-200"
                  }`}
                  title={size}
                  onClick={() => handleSizeToggle(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>

        <div className="bg-white p-3 rounded-md">
          <p className="font-bold">Upload Images</p>

          <div className="mt-4">
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={imageInputElRef}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setProductInfo((prev) => ({
                  ...prev,
                  images: [...prev.images, ...files],
                }));
              }}
            />

            <div className="grid grid-cols-3 gap-4">
              {productInfo.images.map((image, index) => (
                <div key={index} className="h-[120px] relative">
                  <div className="absolute top-1 right-1">
                    <button
                      type="button"
                      className="text-red-500 rounded-full text-xl "
                      onClick={() => {
                        setProductInfo((prev) => {
                          return {
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                            deletedImages: [...prev.deletedImages, image],
                          };
                        });
                      }}
                    >
                      <RxCross2 />
                    </button>
                  </div>

                  <img
                    src={formatImageUrl(image)}
                    alt="product"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              <div
                className="flex items-center justify-center h-[120px]  border-2 border-dashed rounded-md cursor-pointer"
                onClick={() => {
                  imageInputElRef.current.click();
                }}
              >
                <FaCirclePlus className="text-3xl text-green-400" />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-bold">Color</p>

            <div className="grid grid-cols-9 gap-y-4 mt-2">
              {COLORS.map((color, index) => (
                <Tooltip key={index} content={color} placement="top">
                  <div
                    className={`w-10 h-10 rounded border cursor-pointer ${
                      productInfo.colors.includes(color)
                        ? "ring-2 ring-black"
                        : ""
                    }`}
                    title={color}
                    onClick={() => handleColorToggle(color)}
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFrom;
