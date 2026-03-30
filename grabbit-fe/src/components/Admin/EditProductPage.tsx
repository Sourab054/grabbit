import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
import axios from "axios";

import type { Product } from "../../types";

const EditProductForm = ({ initialData }: { initialData: Product }) => {
  const [productData, setProductData] = useState<Product>(initialData);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setProductData((prevData) => ({
          ...prevData,
          images: [
            ...prevData.images,
            { url: data.imageUrl, altText: file.name || "" },
          ],
        }));
        setUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(updateProduct({ id: initialData._id, productData }));
    navigate("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Product Name</label>

        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Description</label>

        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
          required
        />
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Price</label>

        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Count In stock */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Count in Stock</label>

        <input
          type="number"
          name="countInStock"
          value={productData.countInStock}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* SKU */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">SKU</label>

        <input
          type="text"
          name="sku"
          value={productData.sku}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Sizes (comma-separated)
        </label>

        <input
          type="text"
          name="sizes"
          value={productData.sizes?.join(", ")}
          onChange={(e) =>
            setProductData({
              ...productData,
              sizes: e.target.value
                .split(",")
                .map((size: string) => size.trim()),
            })
          }
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Colors */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Colors (comma-separated)
        </label>

        <input
          type="text"
          name="colors"
          value={productData.colors?.join(", ")}
          onChange={(e) =>
            setProductData({
              ...productData,
              colors: e.target.value
                .split(",")
                .map((color: string) => color.trim()),
            })
          }
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload Image</label>
        <input
          id="image-upload"
          type="file"
          onChange={handleImageUpload}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md inline-block transition-colors"
        >
          {uploading ? "Uploading..." : "Choose File"}
        </label>

        <div className="flex gap-4 mt-4">
          {productData.images?.map((image, index: number) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  setProductData({
                    ...productData,
                    images: productData.images.filter((_, i) => i !== index),
                  });
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors"
      >
        Update Product
      </button>
    </form>
  );
};

const EditProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      {selectedProduct ? (
        <EditProductForm
          initialData={selectedProduct}
          key={selectedProduct._id}
        />
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default EditProductPage;
