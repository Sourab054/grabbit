import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import type { PayPalOrderDetails } from "../../types/paypal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!cart || !cart.products.length) navigate("/");
  }, [cart, navigate]);

  const handleCreateCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await dispatch(
      createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Paypal",
        totalPrice: cart.totalPrice,
      }),
    );
    if (createCheckout.fulfilled.match(res)) {
      setCheckoutId(res.payload._id);
      toast.success("Shipping address and order details confirmed.");
    } else {
      toast.error("Failed to create checkout. Please try again.");
    }
  };

  const handlePaymentSuccess = async (details: PayPalOrderDetails) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentDetails: details,
          paymentStatus: "paid",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      toast.success("Payment successful!");
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Payment update failed:", error);
      toast.error("Payment failed! Please try again.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId: string | null) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      toast.success("Order confirmed!");
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Order finalization failed:", error);
      toast.error("Failed to finalize order. Please contact support.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-winterella-off-white min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-oswald uppercase tracking-tighter mb-12 border-b-4 border-winterella-black pb-6 inline-block">
          Checkout
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Section (Forms) */}
          <div className="lg:col-span-7 space-y-12">
            <form onSubmit={handleCreateCheckout} className="space-y-10">
              <section>
                <h3 className="text-2xl font-oswald uppercase mb-6 tracking-tight">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-inter mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full h-14 px-4 border border-gray-200 bg-gray-50 text-gray-500 font-inter rounded-none cursor-not-allowed"
                    disabled
                  />
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-oswald uppercase mb-6 tracking-tight">
                  Shipping Delivery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        address: e.target.value,
                      })
                    }
                    className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 border border-winterella-black focus:border-winterella-red focus:outline-none font-inter transition-all"
                      required
                    />
                  </div>
                </div>
              </section>

              <div className="pt-8">
                {!checkoutId ? (
                  <button
                    type="submit"
                    className="w-full bg-winterella-red text-white h-20 flex items-center justify-center font-oswald text-2xl uppercase tracking-widest hover:bg-winterella-black transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                  >
                    Proceed to Payment
                  </button>
                ) : (
                  <div className="p-8 bg-white border-2 border-winterella-black">
                    <h3 className="text-2xl font-oswald uppercase mb-6 text-center">
                      Complete Your Payment
                    </h3>
                    <PayPalButton
                      amount={cart.totalPrice.toString()}
                      onSuccess={handlePaymentSuccess}
                      onError={() => toast.error("Payment failed! Please try again.")}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Section (Order Summary) */}
          <div className="lg:col-span-5 bg-winterella-black text-white p-8 md:p-12 rounded-[40px] shadow-2xl self-start overflow-hidden relative">
            <h3 className="text-3xl font-oswald uppercase mb-10 tracking-tight border-b border-gray-800 pb-4">
              Your Order
            </h3>

            <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar-white">
              {cart.products.map((product, index) => (
                <div key={index} className="flex gap-6 items-center">
                  <div className="relative shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-32 object-cover rounded-2xl shadow-lg border border-gray-800"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-oswald uppercase text-lg leading-tight tracking-tight mb-1">
                      {product.name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-inter">
                      {product.size} / {product.color}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-inter mt-1">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                  <p className="font-oswald font-bold text-xl">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 space-y-4">
              <div className="flex justify-between items-center font-oswald uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span className="text-white text-xl">
                  ${cart.totalPrice?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center font-oswald uppercase tracking-widest text-gray-400">
                <span>Shipping</span>
                <span className="text-winterella-yellow italic">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-gray-800">
                <span className="font-oswald uppercase text-2xl tracking-tighter">
                  Total Due
                </span>
                <span className="text-4xl font-oswald font-bold text-winterella-red">
                  ${cart.totalPrice?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
