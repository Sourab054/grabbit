import { Link } from "react-router-dom";
import type { Product } from "../../types";

const ProductGrid = ({
  products,
  loading,
  error,
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
}) => {
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Error: {error}</p>;

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full col-span-full">
        <h3 className="text-4xl font-oswald uppercase mb-4 tracking-tighter">
          No products found
        </h3>
        <p className="text-gray-500 text-lg uppercase tracking-widest text-center">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <Link
          key={index}
          to={`/product/${product._id}`}
          className="group block"
        >
          <div className="bg-transparent overflow-hidden">
            <div className="relative w-full h-[500px] mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
              />
            </div>
            <h3 className="text-lg font-oswald uppercase tracking-tight mb-1 group-hover:text-winterella-red transition-colors">
              {product.name}
            </h3>
            <p className="text-xl font-black text-winterella-black">
              $ {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
