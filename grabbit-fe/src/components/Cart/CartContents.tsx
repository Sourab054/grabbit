import { RiDeleteBin3Line } from "react-icons/ri";
import type { Cart, CartProduct } from "../../types";
import { useDispatch } from "react-redux";
import {
  removeProductFromCart,
  updateProductQuantityInCart,
} from "../../redux/slices/cartSlice";
import type { AppDispatch } from "../../redux/store";
import { toast } from "sonner";

const CartContents = ({
  cart,
  userId,
  guestId,
}: {
  cart: Cart;
  userId: string | null;
  guestId: string | null;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (
    productId: string,
    delta: number,
    quantity: number,
    size?: string,
    color?: string,
  ) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateProductQuantityInCart({
          productId,
          guestId,
          userId,
          quantity: newQuantity,
          size,
          color,
        }),
      );
      toast.success("Quantity updated", {
        duration: 1500,
        id: `cart-${productId}-${size}-${color}`,
      });
    }
  };

  const handleRemoveFromCart = (
    productId: string,
    size?: string,
    color?: string,
  ) => {
    dispatch(
      removeProductFromCart({
        productId,
        guestId,
        userId,
        size,
        color,
      }),
    );
    toast.success("Item removed from cart");
  };

  return (
    <div className="space-y-6">
      {cart?.products?.map((product: CartProduct, index: number) => (
        <div
          key={index}
          className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0"
        >
          <div className="relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-32 object-cover rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between self-stretch">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-oswald uppercase text-lg leading-tight tracking-tight">
                  {product.name}
                </h3>
                <p className="font-oswald font-bold text-lg">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-inter">
                {product.size} / {product.color}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border border-gray-200 rounded-full h-10 px-2 bg-white/50">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-winterella-red transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold font-inter">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-winterella-red transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color,
                  )
                }
                className="p-2 text-gray-300 hover:text-winterella-red transition-colors cursor-pointer"
                title="Remove item"
              >
                <RiDeleteBin3Line className="h-6 w-6 text-winterella-red" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
