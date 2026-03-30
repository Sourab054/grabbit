import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
import axios from "axios";
import { toast } from "sonner";
import type { Product } from "../../types";
import { FaChevronLeft } from "react-icons/fa";

const EditProductForm = ({ initialData }: { initialData: Product }) => {
  const [productData, setProductData] = useState<Product>(initialData);
  const [sizeInput, setSizeInput] = useState(initialData.sizes?.join(", ") || "");
  const [colorInput, setColorInput] = useState(initialData.colors?.join(", ") || "");
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
        toast.success("Image uploaded successfully");
        setUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Parse size and color inputs into arrays
    const sizes = sizeInput.split(",").map((s) => s.trim()).filter((s) => s !== "");
    const colors = colorInput.split(",").map((c) => c.trim()).filter((c) => c !== "");

    const price = parseFloat(productData.price as unknown as string);
    const countInStock = parseInt(productData.countInStock as unknown as string, 10);

    const resultAction = await dispatch(updateProduct({ 
      id: initialData._id, 
      productData: { ...productData, sizes, colors, price, countInStock } 
    }));
    if (updateProduct.fulfilled.match(resultAction)) {
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Product Name</label>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Description</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price */}
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
            />
          </div>

          {/* Count In stock */}
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
            />
          </div>
      </div>

      {/* Sizes & Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Sizes (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Colors (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="w-full border-4 border-black p-4 font-bold focus:outline-none bg-white"
            />
          </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-oswald uppercase text-xs tracking-widest mb-2 text-gray-500">Product Images</label>
        <div className="flex items-center space-x-4">
            <input
            id="image-upload"
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            />
            <label
            htmlFor="image-upload"
            className="cursor-pointer bg-black text-white p-4 font-oswald uppercase text-xs tracking-widest hover:bg-winterella-red transition-all border-4 border-black"
            >
            {uploading ? "Uploading..." : "Upload New Image"}
            </label>
        </div>

        <div className="flex gap-4 mt-6">
          {productData.images?.map((image, index: number) => (
            <div key={index} className="relative group border-4 border-black p-1 bg-white">
              <img
                src={image.url}
                alt={image.altText || "Product Image"}
                className="w-24 h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setProductData({
                    ...productData,
                    images: productData.images.filter((_, i) => i !== index),
                  });
                }}
                className="absolute -top-3 -right-3 bg-winterella-red text-white border-2 border-black rounded-none w-8 h-8 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-6 font-oswald text-xl uppercase tracking-widest hover:bg-winterella-red transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
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

  if (loading) return (
    <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winterella-red"></div>
    </div>
  );
  if (error) return <div className="p-12 text-center font-oswald uppercase tracking-widest border-6 border-black bg-red-100 text-red-800">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/admin/products"
        className="inline-flex items-center space-x-2 text-black hover:text-winterella-red transition-colors mb-6 font-oswald uppercase tracking-widest text-sm font-bold"
      >
        <FaChevronLeft />
        <span>Back to Products</span>
      </Link>

      <div className="mb-10">
        <h2 className="text-4xl font-oswald uppercase tracking-tighter">Edit Product</h2>
        <p className="text-sm text-gray-500 font-oswald uppercase tracking-widest mt-2 px-1">ID: {id}</p>
      </div>

      <div className="bg-white p-10 border-6 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {selectedProduct ? (
            <EditProductForm
            initialData={selectedProduct}
            key={selectedProduct._id}
            />
        ) : (
            <div className="p-12 text-center font-oswald uppercase tracking-widest bg-winterella-off-white">Product not found.</div>
        )}
      </div>
    </div>
  );
};

export default EditProductPage;
