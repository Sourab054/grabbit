import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { checkout } = useSelector((state: RootState) => state.checkout);
  const calculateEstimatedDelivery = (createdAt: Date) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
    return orderDate.toLocaleDateString();
  };

  console.log(checkout, "CHECKOUIT");

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else navigate("/my-orders");
  }, [checkout, navigate, dispatch]);

  return (
    <div className="bg-winterella-off-white min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-winterella-red text-white px-6 py-2 font-oswald uppercase tracking-widest text-sm mb-6">
            Order Successful
          </div>
          <h1 className="text-6xl md:text-8xl font-oswald uppercase tracking-tighter text-winterella-black mb-4">
            Thank You
          </h1>
          <p className="text-gray-500 font-inter uppercase tracking-[0.2em] text-sm">
            Your order has been placed successfully
          </p>
        </div>

        {checkout && (
          <div className="bg-white border-[6px] border-winterella-black p-8 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden">
            {/* Top Accents */}
            <div className="absolute top-0 left-0 w-32 h-2 bg-winterella-red"></div>
            <div className="absolute top-0 right-0 w-32 h-2 bg-winterella-yellow"></div>

            <div className="flex flex-col md:flex-row justify-between gap-12 mb-16 pb-12 border-b-2 border-gray-100">
              {/* Order ID and Date */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-inter">
                  Order Reference
                </span>
                <h2 className="text-2xl font-oswald uppercase tracking-tight">
                  #{checkout._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-gray-500 text-sm font-inter">
                  Placed on{" "}
                  {new Date(checkout.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Estimated Delivery */}
              <div className="md:text-right space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-inter">
                  Delivery Estimate
                </span>
                <p className="text-xl font-oswald font-bold text-winterella-red uppercase tracking-tight">
                  {calculateEstimatedDelivery(checkout.createdAt)}
                </p>
                <p className="text-gray-500 text-xs font-inter flex items-center md:justify-end gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Processing at Logistics Center
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-8 mb-16">
              <h3 className="text-xl font-oswald uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                Items Summary
              </h3>
              {checkout?.checkoutItems?.map((item) => (
                <div key={item.productId} className="flex gap-6 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-28 object-cover rounded-2xl shadow-sm border border-gray-50"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-lg font-oswald uppercase leading-none tracking-tight">
                      {item.name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-inter">
                      {item.color} | {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-oswald font-bold">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t-2 border-gray-100">
              {/* Payment Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-oswald uppercase tracking-widest text-gray-400">
                  Payment Method
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-blue-50 rounded flex items-center justify-center font-bold text-blue-800 text-[10px] italic">
                    PayPal
                  </div>
                  <p className="text-winterella-black font-inter font-medium uppercase text-xs tracking-wider">
                    Account Linked • PAID
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-oswald uppercase tracking-widest text-gray-400">
                  Shipping Address
                </h4>
                <div className="text-winterella-black font-inter text-sm leading-relaxed">
                  <p className="font-bold uppercase tracking-tight">
                    {checkout?.shippingAddress?.firstName}{" "}
                    {checkout?.shippingAddress?.lastName}
                  </p>
                  <p className="opacity-70">
                    {checkout?.shippingAddress?.address}
                  </p>
                  <p className="opacity-70">
                    {checkout?.shippingAddress?.city},{" "}
                    {checkout?.shippingAddress?.country}{" "}
                    {checkout?.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col md:flex-row gap-4 items-center justify-between">
              <button
                onClick={() => navigate("/my-orders")}
                className="w-full md:w-auto px-10 py-4 bg-winterella-black text-white font-oswald uppercase tracking-widest hover:bg-winterella-red transition-all cursor-pointer"
              >
                Track My Order
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-winterella-black font-oswald uppercase tracking-widest text-sm underline hover:text-winterella-red transition-all"
              >
                Return to Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
