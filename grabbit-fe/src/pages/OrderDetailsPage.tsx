import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { orderDetails, loading, error } = useSelector(
    (state: RootState) => state.orders,
  );

  useEffect(() => {
    dispatch(fetchOrderDetails(id!));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-winterella-off-white min-h-screen py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block bg-winterella-red text-white px-4 py-1 font-oswald uppercase tracking-widest text-xs mb-4">
              Order Details
            </div>
            <h1 className="text-4xl md:text-6xl font-oswald uppercase tracking-tighter text-winterella-black">
              #{orderDetails?._id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <Link 
            to="/my-orders" 
            className="text-winterella-black font-oswald uppercase tracking-widest text-sm underline hover:text-winterella-red transition-all"
          >
            ← Back to My Orders
          </Link>
        </div>

        {!orderDetails ? (
          <div className="bg-white border-[6px] border-winterella-black p-16 rounded-[40px] text-center">
            <p className="text-gray-400 font-inter italic text-lg">Order not found.</p>
          </div>
        ) : (
          <div className="bg-white border-[6px] border-winterella-black p-8 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden">
            {/* Top Accents */}
            <div className="absolute top-0 left-0 w-32 h-2 bg-winterella-red"></div>
            <div className="absolute top-0 right-0 w-32 h-2 bg-winterella-yellow"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 pb-12 border-b-2 border-gray-100">
              {/* Timing & Status */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-inter block">Placement info</span>
                <p className="text-lg font-inter text-gray-600">
                  Placed on {new Date(orderDetails.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border-2 ${
                    orderDetails.isPaid ? "border-green-100 bg-green-50 text-green-700" : "border-winterella-red/20 bg-winterella-red/5 text-winterella-red"
                  }`}>
                    {orderDetails.isPaid ? "Payment Verified" : "Payment Pending"}
                  </span>
                  <span className={`px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border-2 ${
                    orderDetails.isDelivered ? "border-green-100 bg-green-50 text-green-700" : "border-winterella-yellow/20 bg-winterella-yellow/5 text-winterella-yellow"
                  }`}>
                    {orderDetails.isDelivered ? "Delivered" : "In Transit"}
                  </span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-inter block">Shipping Destination</span>
                <div className="text-winterella-black font-inter text-sm leading-relaxed">
                  <p className="font-bold uppercase tracking-tight">{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                  <p className="opacity-70">{orderDetails.shippingAddress.address}</p>
                  <p className="opacity-70">
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country} {orderDetails.shippingAddress.postalCode}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-inter block">Payment Method</span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-blue-50 rounded flex items-center justify-center font-bold text-blue-800 text-[10px] italic">PayPal</div>
                  <p className="text-winterella-black font-inter font-medium uppercase text-xs tracking-wider">
                    {orderDetails.paymentMethod} • {orderDetails.isPaid ? "PAID" : "UNPAID"}
                  </p>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-8 mb-16">
              <h3 className="text-xl font-oswald uppercase tracking-widest mb-8 border-b border-gray-100 pb-2">Ordered Items</h3>
              <div className="space-y-6">
                {orderDetails.orderItems.map((item) => (
                  <div key={item.productId} className="flex gap-8 items-center bg-gray-50/50 p-4 rounded-3xl border border-gray-100 hover:border-winterella-black/20 transition-all">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-32 object-cover rounded-2xl shadow-sm border border-white"
                    />
                    <div className="flex-1 space-y-2">
                      <Link 
                        to={`/product/${item.productId}`}
                        className="text-xl font-oswald uppercase leading-none tracking-tight hover:text-winterella-red transition-all"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-inter">
                         Qty: {item.quantity} | Unit: ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-oswald font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Section */}
            <div className="pt-12 border-t-2 border-gray-100">
              <div className="max-w-sm ml-auto space-y-4">
                <div className="flex justify-between items-center text-gray-400 font-oswald uppercase tracking-widest text-sm">
                  <span>Subtotal</span>
                  <span className="text-winterella-black">${orderDetails.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-oswald uppercase tracking-widest text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 italic">Complimentary</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-gray-100">
                  <span className="font-oswald uppercase text-2xl tracking-tighter">Total Amount</span>
                  <span className="text-4xl font-oswald font-bold text-winterella-red">
                    ${orderDetails.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
