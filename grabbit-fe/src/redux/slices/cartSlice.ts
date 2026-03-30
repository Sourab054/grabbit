import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  Cart,
  CartState,
  FetchCartParams,
  AddProductParams,
  RemoveProductParams,
  UpdateQuantityParams,
  MergeCartParams,
  ErrorResponse,
} from "../../types";

// Helper function to load cart from localStorage
const loadCartFromStorage = (): Cart => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [], totalPrice: 0 };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart: Cart): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk<
  Cart,
  FetchCartParams,
  { rejectValue: ErrorResponse }
>("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.get<Cart>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      {
        params: { userId, guestId },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as ErrorResponse);
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});

// Add a product to cart for a user or guest
export const addProductToCart = createAsyncThunk<
  Cart,
  AddProductParams,
  { rejectValue: ErrorResponse }
>(
  "cart/addProductToCart",
  async (
    { userId, guestId, productId, quantity, color, size }: AddProductParams,
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post<Cart>(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, color, size, userId, guestId },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as ErrorResponse);
      }
      return rejectWithValue({ message: "An unknown error occurred" });
    }
  },
);

// Remove a product from cart for a user or guest
export const removeProductFromCart = createAsyncThunk<
  Cart,
  RemoveProductParams,
  { rejectValue: ErrorResponse }
>(
  "cart/removeProductFromCart",
  async ({ userId, guestId, productId, size, color }: RemoveProductParams, { rejectWithValue }) => {
    try {
      const response = await axios.delete<Cart>(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { data: { userId, guestId, productId, size, color } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as ErrorResponse);
      }
      return rejectWithValue({ message: "An unknown error occurred" });
    }
  },
);

// Update the quantity of a product in cart for a user or guest
export const updateProductQuantityInCart = createAsyncThunk<
  Cart,
  UpdateQuantityParams,
  { rejectValue: ErrorResponse }
>(
  "cart/updateProductQuantityInCart",
  async (
    { userId, guestId, productId, quantity, size, color }: UpdateQuantityParams,
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put<Cart>(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { userId, guestId, productId, quantity, size, color },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as ErrorResponse);
      }
      return rejectWithValue({ message: "An unknown error occurred" });
    }
  },
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk<
  Cart,
  MergeCartParams,
  { rejectValue: ErrorResponse }
>("cart/mergeCart", async ({ guestId, user }, { rejectWithValue }) => {
  try {
    const response = await axios.post<Cart>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
      { guestId, user },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as ErrorResponse);
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});

const initialState: CartState = {
  cart: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [], totalPrice: 0 };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      saveCartToStorage(action.payload);
      state.loading = false;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to fetch cart";
      state.loading = false;
    });
    builder.addCase(addProductToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      saveCartToStorage(action.payload);
      state.loading = false;
    });
    builder.addCase(addProductToCart.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to add product to cart";
      state.loading = false;
    });
    builder.addCase(removeProductFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeProductFromCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      saveCartToStorage(action.payload);
      state.loading = false;
    });
    builder.addCase(removeProductFromCart.rejected, (state, action) => {
      state.error =
        action.payload?.message ?? "Failed to remove product from cart";
      state.loading = false;
    });
    builder.addCase(updateProductQuantityInCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProductQuantityInCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      saveCartToStorage(action.payload);
      state.loading = false;
    });
    builder.addCase(updateProductQuantityInCart.rejected, (state, action) => {
      state.error =
        action.payload?.message ?? "Failed to update product quantity";
      state.loading = false;
    });
    builder.addCase(mergeCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(mergeCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.loading = false;
    });
    builder.addCase(mergeCart.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to merge cart";
      state.loading = false;
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
