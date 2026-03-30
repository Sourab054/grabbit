import { HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-winterella-off-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-none mb-4 bg-winterella-black text-white">
            <HiShoppingBag className="text-3xl" />
          </div>
          <h4 className="font-oswald font-bold text-xl uppercase tracking-tighter mb-2">FREE SHIPPING</h4>
          <p className="text-winterella-black text-sm uppercase tracking-widest font-medium">
            On all orders over $ 19.99 and above.
          </p>
        </div>
        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-none mb-4 bg-winterella-black text-white">
            <HiArrowPathRoundedSquare className="text-3xl" />
          </div>
          <h4 className="font-oswald font-bold text-xl uppercase tracking-tighter mb-2">45 DAYS RETURN</h4>
          <p className="text-winterella-black text-sm uppercase tracking-widest font-medium">
            Money back guarantee.
          </p>
        </div>
        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-none mb-4 bg-winterella-black text-white">
            <HiOutlineCreditCard className="text-3xl" />
          </div>
          <h4 className="font-oswald font-bold text-xl uppercase tracking-tighter mb-2">SECURE CHECKOUT</h4>
          <p className="text-winterella-black text-sm uppercase tracking-widest font-medium">
            100% Secure Checkout. No credit card details are stored.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
