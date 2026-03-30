import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface CartDrawerProps {
  drawerOpen: boolean;
  toggleCartDrawer: () => void;
}

const CartDrawer = ({ drawerOpen, toggleCartDrawer }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state: RootState) => state.auth);
  const { cart } = useSelector((state: RootState) => state.cart);

  const userId = user ? user?._id : null;

  const handleCheckout = () => {
    if (!userId) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
    toggleCartDrawer();
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-[450px] h-full bg-winterella-off-white shadow-2xl transform transition-transform duration-500 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-3xl font-oswald uppercase tracking-tighter">
          Your Cart
        </h2>
        <button
          onClick={toggleCartDrawer}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <IoMdClose className="h-8 w-8 text-winterella-black" />
        </button>
      </div>

      <div className="grow p-6 overflow-y-auto custom-scrollbar">
        {cart?.products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-400 font-inter mb-4">Your cart is empty</p>
            <button
              onClick={toggleCartDrawer}
              className="text-winterella-red underline font-oswald uppercase tracking-wider"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {cart && cart.products.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-oswald uppercase text-gray-500 text-sm tracking-widest">
                Subtotal
              </span>
              <span className="text-2xl font-oswald font-bold">
                ${cart.totalPrice?.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-winterella-red text-white h-16 flex items-center justify-center font-oswald text-xl uppercase tracking-widest hover:bg-winterella-black transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
            >
              Checkout Now
            </button>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 text-center font-inter">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
