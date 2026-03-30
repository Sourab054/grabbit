import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders,
  );

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto py-5">
      <div className="flex justify-between items-baseline border-b-2 border-winterella-black pb-4">
        <h2 className="text-3xl md:text-4xl font-oswald uppercase tracking-tighter">
          My Order History
        </h2>
        <span className="font-inter text-xs uppercase tracking-widest text-gray-400">
          {orders?.length || 0} Total Orders
        </span>
      </div>

      <div className="space-y-4 max-h-[750px] overflow-y-auto pr-4 custom-scrollbar">
        {orders?.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              onClick={() => handleRowClick(order._id)}
              className="bg-white border-2 border-gray-100 p-4 px-5 md:py-5 md:px-6 rounded-[32px] hover:border-winterella-black transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex gap-6 items-center">
                <div className="relative shrink-0">
                  <img
                    src={order.orderItems?.[0]?.image}
                    alt={order.orderItems?.[0]?.name || "Order item"}
                    className="w-20 h-28 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-500"
                  />
                  {order.orderItems?.length > 1 && (
                    <div className="absolute -bottom-2 -right-2 bg-winterella-black text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-xs border-2 border-white">
                      +{order.orderItems.length - 1}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-inter">
                    Order Ref
                  </span>
                  <h3 className="text-xl font-oswald uppercase tracking-tight group-hover:text-winterella-red transition-colors">
                    #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-inter">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{order.orderItems?.length} Item(s)</span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-4 md:gap-2">
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-inter">
                    Total Amount
                  </span>
                  <p className="text-2xl font-oswald font-bold">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border-2 ${
                    order.isPaid
                      ? "border-green-100 bg-green-50 text-green-700"
                      : "border-winterella-red/20 bg-winterella-red/5 text-winterella-red"
                  }`}
                >
                  {order.isPaid ? "Payment Verified" : "Payment Pending"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-200">📦</span>
            </div>
            <p className="text-gray-400 font-inter italic">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/collection/all")}
              className="text-winterella-red font-oswald uppercase tracking-widest underline hover:text-winterella-black transition-colors"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
