import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addProductToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }: { productId?: string }) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, loading, similarProducts, error } = useSelector(
    (state: RootState) => state.products,
  );
  const { guestId, user } = useSelector((state: RootState) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isBtnDisabled, setisBtnDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    }
  }, [productFetchId, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setMainImage(selectedProduct.images?.[0]?.url || "");
      setSelectedSize(selectedProduct.sizes?.[0] || "");
      setSelectedColor(selectedProduct.colors?.[0] || "");
      setQuantity(1);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (type: "plus" | "minus") => {
    if (type === "plus") {
      setQuantity(quantity + 1);
    } else if (type === "minus" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color", {
        duration: 1000,
      });
      return;
    }

    if (!productFetchId) {
      return;
    }

    setisBtnDisabled(true);
    await dispatch(
      addProductToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        userId: user?._id,
        guestId,
      }),
    );
    toast.success("Added to cart", {
      duration: 1000,
    });
    setisBtnDisabled(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;

  const discountPercentage =
    selectedProduct?.price && selectedProduct?.discountPrice
      ? Math.round(
          ((selectedProduct.price - selectedProduct.discountPrice) /
            selectedProduct.price) *
            100,
        )
      : 0;

  return (
    <div className="p-4 md:p-12 bg-winterella-off-white min-h-screen">
      {selectedProduct && (
        <div className="max-w-7xl mx-auto bg-transparent p-0 lg:p-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch">
            {/* Thumbnails Section */}
            <div className="order-2 md:order-1 flex md:flex-col gap-4">
              {selectedProduct?.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                    image.url === mainImage
                      ? "border-winterella-red scale-105 shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Content Area (50/50 split) */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch order-1 md:order-2">
              {/* Main Image Container */}
              <div className="flex-1">
                <img
                  src={mainImage}
                  alt="Product"
                  className="w-full h-full object-cover rounded-[40px] shadow-2xl aspect-3/4"
                />
              </div>

              {/* Info Block */}
              <div className="flex-1 bg-winterella-black text-white p-8 md:p-12 rounded-[40px] shadow-xl flex flex-col justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-oswald uppercase leading-[1.1] mb-6 tracking-tight">
                    {selectedProduct?.name}
                  </h1>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                    {selectedProduct?.description}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-3xl font-bold font-oswald">
                      $
                      {selectedProduct?.discountPrice || selectedProduct?.price}
                    </span>
                    {selectedProduct?.discountPrice && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ${selectedProduct?.price}
                        </span>
                        <span className="text-winterella-red font-bold text-sm">
                          {discountPercentage}% discount
                        </span>
                      </>
                    )}
                  </div>

                  {/* Color Selector */}
                  <div className="mb-10">
                    <p className="text-sm font-medium mb-4">
                      Color: {selectedColor}
                    </p>
                    <div className="flex gap-3">
                      {selectedProduct?.colors?.map((color: string) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${
                            selectedColor === color
                              ? "border-winterella-red scale-110 shadow-[0_0_10px_rgba(232,59,19,0.5)]"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium">
                        Size: {selectedSize || "M"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct?.sizes?.map((size: string) => (
                        <button
                          key={size}
                          className={`w-12 h-10 border font-oswald transition-all duration-300 ${
                            selectedSize === size
                              ? "border-winterella-red bg-winterella-red/10 shadow-[0_0_15px_rgba(232,59,19,0.4)]"
                              : "border-gray-700 text-gray-400 hover:border-gray-500"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Section */}
                  <div className="flex items-stretch gap-4 mb-12">
                    <div className="flex items-center border border-gray-700 p-1">
                      <button
                        onClick={() => handleQuantityChange("minus")}
                        className="w-10 h-10 flex items-center justify-center text-xl text-gray-400 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("plus")}
                        className="w-10 h-10 flex items-center justify-center text-xl text-gray-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={isBtnDisabled}
                      className={`flex-1 bg-winterella-red text-white py-4 px-8 rounded-full font-oswald text-lg uppercase tracking-wider transition-transform active:scale-95 ${
                        isBtnDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:brightness-110"
                      }`}
                    >
                      {isBtnDisabled ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Characteristics Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <h3 className="text-lg font-oswald uppercase mb-6 tracking-wider">
                    Characteristics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Brand</span>
                      <span className="font-medium">
                        {selectedProduct?.brand}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Material</span>
                      <span className="font-medium">
                        {selectedProduct?.material}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-4xl text-center font-oswald uppercase mb-10 tracking-tighter">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
