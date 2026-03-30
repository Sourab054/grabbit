import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { deleteOrder, fetchAllOrders, updateOrderStatus, clearError } from "../../redux/slices/adminOrderSlice";
import { toast } from "sonner";
import { useState } from "react";
import Pagination from "../Common/Pagination";

const OrderManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.adminOrders,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(fetchAllOrders());
    } else {
      navigate("/");
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    const resultAction = await dispatch(updateOrderStatus({ id: orderId, status }));
    if (updateOrderStatus.fulfilled.match(resultAction)) {
      toast.success(`Order status updated to ${status}`);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      const resultAction = await dispatch(deleteOrder(orderId));
      if (deleteOrder.fulfilled.match(resultAction)) {
        toast.success("Order deleted successfully");
      }
    }
  };

  if (loading && orders.length === 0) return (
    <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winterella-red"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto font-inter">
      <h2 className="text-4xl font-oswald uppercase tracking-tighter mb-10">Order Management</h2>

      <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-black text-white font-oswald uppercase text-xs tracking-widest">
            <tr>
              <th className="py-4 px-6 border-r border-gray-800">Order ID</th>
              <th className="py-4 px-6 border-r border-gray-800">Customer</th>
              <th className="py-4 px-6 border-r border-gray-800">Total Price</th>
              <th className="py-4 px-6 border-r border-gray-800">Status</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {orders.length > 0 ? (
              orders
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((order) => (
                  <tr key={order?._id} className="hover:bg-winterella-off-white transition-colors duration-200">
                    <td className="p-6 font-bold border-r border-black font-mono text-xs whitespace-nowrap">
                      #{order?._id.toUpperCase()}
                    </td>
                    <td className="p-6 border-r border-black">
                      <div className="font-bold text-sm uppercase tracking-tight">{order?.user?.name || "Guest"}</div>
                      <div className="text-xs text-gray-500 mt-1">{order?.user?.email}</div>
                    </td>
                    <td className="p-6 border-r border-black font-bold text-lg">
                      ${order?.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-6 border-r border-black font-semibold">
                      <select
                        value={order?.status}
                        onChange={(e) =>
                          handleStatusChange(order?._id, e.target.value)
                        }
                        className={`p-2 border-2 border-black font-oswald uppercase text-xs tracking-widest focus:outline-none bg-white
                          ${order?.status === 'Delivered' ? 'text-green-700' : 'text-yellow-700'}
                        `}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
  
                    <td className="p-6 space-x-2">
                      <button
                        onClick={() =>
                          handleStatusChange(order?._id, "Delivered")
                        }
                        disabled={order?.status === "Delivered"}
                        className={`px-4 py-2 font-oswald text-xs uppercase tracking-widest border-2 border-black transition-all ${order?.status === "Delivered" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-winterella-red shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"}`}
                      >
                        {order?.status === "Delivered"
                          ? "Delivered"
                          : "Deliver"}
                      </button>
                      <button
                        onClick={() => handleDelete(order?._id)}
                        className="bg-white text-black px-4 py-2 font-oswald text-xs uppercase tracking-widest border-2 border-black hover:bg-winterella-red hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500 font-oswald uppercase tracking-widest bg-winterella-off-white">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(orders.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default OrderManagement;
