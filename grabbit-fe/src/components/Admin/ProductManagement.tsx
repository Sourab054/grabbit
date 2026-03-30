import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { useEffect } from "react";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { toast } from "sonner";
import { useState } from "react";
import Pagination from "../Common/Pagination";

const ProductManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      const resultAction = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success("Product deleted successfully");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winterella-red"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-oswald uppercase tracking-tighter">Product Management</h2>
        <Link
          to="/admin/products/create"
          className="bg-winterella-red text-white py-3 px-8 font-oswald uppercase tracking-widest hover:bg-black transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto border-4 border-black">
        <table className="min-w-full text-left bg-white font-inter">
          <thead className="bg-black text-white font-oswald uppercase text-xs tracking-widest">
            <tr>
              <th className="py-4 px-6 border-r border-gray-800">Image</th>
              <th className="py-4 px-6 border-r border-gray-800">Name</th>
              <th className="py-4 px-6 border-r border-gray-800">Price</th>
              <th className="py-4 px-6 border-r border-gray-800">SKU</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {products.length > 0 ? (
              products
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-winterella-off-white transition-colors duration-200"
                  >
                    <td className="p-4 border-r border-black">
                      <img
                        src={product.images?.[0]?.url || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="w-16 h-16 object-cover border-2 border-black"
                      />
                    </td>
                    <td className="p-6 font-bold text-black border-r border-black text-sm uppercase tracking-tight">
                      {product.name}
                    </td>
  
                    <td className="p-6 border-r border-black font-semibold">${product.price}</td>
  
                    <td className="p-6 border-r border-black font-mono text-xs">{product.sku}</td>
  
                    <td className="p-6 space-x-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="bg-black text-white px-4 py-2 font-oswald text-xs uppercase tracking-widest hover:bg-winterella-red transition-all inline-block border-2 border-black"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-white text-black px-4 py-2 font-oswald text-xs uppercase tracking-widest hover:bg-winterella-red hover:text-white transition-all inline-block border-2 border-black"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500 font-oswald uppercase tracking-widest bg-winterella-off-white">
                  No Products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(products.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ProductManagement;
