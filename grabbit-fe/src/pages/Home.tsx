import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { useEffect, useState } from "react";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import type { Product } from "../types";
import type { AppDispatch, RootState } from "../redux/store";

const Home = () => {
  const [bestSeller, setBestSeller] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Top Wear",
        limit: "8",
      }),
    );
    // Fetch Best seller product
    const fetchBestSeller = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        setBestSeller(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className="text-5xl text-center font-oswald uppercase mb-8 tracking-tighter">
        Best Seller
      </h2>
      {bestSeller ? (
        <ProductDetails productId={bestSeller._id} />
      ) : (
        <p className="text-center">Loading...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-5xl text-center font-oswald uppercase mb-8 tracking-tighter">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
