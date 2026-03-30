import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { createProduct, clearError } from "../../redux/slices/adminProductSlice";
import axios from "axios";
import { toast } from "sonner";
import { FaChevronLeft } from "react-icons/fa";

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [] as string[],
    colors: [] as string[],
    collections: "",
    material: "",
    gender: "",
    images: [] as { url: string; altText: string }[],
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

    const resultAction = await dispatch(createProduct({ ...productData, price, countInStock, sizes, colors }));
    if (createProduct.fulfilled.match(resultAction)) {
      toast.success("Product created successfully!");
      navigate("/admin/products");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-none border-6 border-black">
      <Link
        to="/admin/products"
        className="inline-flex items-center space-x-2 text-black hover:text-winterella-red transition-colors mb-6 font-oswald uppercase tracking-widest text-sm font-bold"
      >
        <FaChevronLeft />
        <span>Back to Products</span>
      </Link>
      
      <h2 className="text-4xl font-oswald uppercase mb-8 tracking-tighter">Create New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-oswald uppercase text-sm mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
            required
            placeholder="Enter product name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-oswald uppercase text-sm mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
            rows={4}
            required
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price */}
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              required
            />
          </div>

          {/* Count In stock */}
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Stock Quantity</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              required
              placeholder="e.g. WH-JKT-001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
            <label className="block font-oswald uppercase text-sm mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              required
              placeholder="e.g. Outerwear"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              required
              placeholder="e.g. Winterella"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sizes */}
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Sizes (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              placeholder="e.g. S, M, L, XL"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Colors (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              placeholder="e.g. Red, Black, White"
            />
          </div>
        </div>

        {/* Collections */}
        <div>
          <label className="block font-oswald uppercase text-sm mb-2">Collection</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
            required
            placeholder="e.g. Winter 2024"
          />
        </div>

        {/* Material & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Material</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0"
              placeholder="e.g. Wool Blend"
            />
          </div>
          <div>
            <label className="block font-oswald uppercase text-sm mb-2">Gender</label>
            <select
               name="gender"
               value={productData.gender}
               onChange={handleChange}
               className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 bg-white"
               required
            >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block font-oswald uppercase text-sm mb-2">Product Images</label>
          <div className="flex items-center space-x-4">
            <input
              id="image-upload"
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-black text-white py-3 px-6 font-oswald uppercase hover:bg-winterella-red transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </label>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images?.map((image, index: number) => (
              <div key={index} className="relative group border-2 border-black p-1">
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
                  className="absolute -top-2 -right-2 bg-winterella-red text-white w-6 h-6 flex items-center justify-center font-bold border-2 border-black hover:bg-black transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-winterella-red text-white py-4 font-oswald text-xl uppercase tracking-widest hover:bg-black transition-colors duration-300 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
