import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { useEffect } from "react";
import { toast } from "sonner";

const AdminHomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state: RootState) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (productsError) toast.error(`Products Error: ${productsError}`);
    if (ordersError) toast.error(`Orders Error: ${ordersError}`);
  }, [productsError, ordersError]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-oswald uppercase mb-10 tracking-tighter">Admin Dashboard</h1>

      {productsLoading || ordersLoading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winterella-red"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-oswald uppercase tracking-widest text-gray-500 mb-2">Total Revenue</h2>
              <p className="text-5xl font-oswald font-bold">${totalSales.toFixed(2)}</p>
            </div>

            <div className="p-8 bg-white border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-oswald uppercase tracking-widest text-gray-500 mb-2">Total Orders</h2>
              <p className="text-5xl font-oswald font-bold mb-4">{totalOrders}</p>
              <Link
                to="/admin/orders"
                className="text-winterella-red font-oswald uppercase text-xs tracking-widest hover:underline"
              >
                Manage Orders →
              </Link>
            </div>

            <div className="p-8 bg-white border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-oswald uppercase tracking-widest text-gray-500 mb-2">Total Products</h2>
                <p className="text-5xl font-oswald font-bold mb-4">{products.length}</p>
              </div>
              <Link
                to="/admin/products"
                className="text-winterella-red font-oswald uppercase text-xs tracking-widest hover:underline"
              >
                Manage Products →
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">Recent Orders</h2>

            <div className="overflow-x-auto border-4 border-black">
              <table className="min-w-full text-left bg-white">
                <thead className="bg-black text-white font-oswald uppercase text-xs tracking-widest">
                  <tr>
                    <th className="py-4 px-6 border-r border-gray-800">Order ID</th>
                    <th className="py-4 px-6 border-r border-gray-800">User</th>
                    <th className="py-4 px-6 border-r border-gray-800">Total Price</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black font-inter">
                  {orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-winterella-off-white transition-colors duration-200"
                      >
                        <td className="p-6 font-medium text-black border-r border-black">{order._id}</td>
                        <td className="p-6 border-r border-black font-semibold text-sm">{order?.user?.name}</td>
                        <td className="p-6 border-r border-black font-bold">${order?.totalPrice.toFixed(2)}</td>
                        <td className="p-6 uppercase text-xs font-bold tracking-widest">
                            <span className={`px-3 py-1 ${order?.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} border border-black`}>
                                {order?.status}
                            </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-500 font-oswald uppercase tracking-widest bg-winterella-off-white">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
