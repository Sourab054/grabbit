import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { CartProduct } from "../../types";

interface Checkout {
  _id: string;
  checkoutItems: CartProduct[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  isFinalized: boolean;
  createdAt: Date;
}

interface CheckoutData {
  checkoutItems: CartProduct[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  totalPrice: number;
}

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk<Checkout, CheckoutData>(
  "checkout/createCheckout",
  async (checkoutdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutdata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null as Checkout | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCheckout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCheckout.fulfilled, (state, action) => {
      state.checkout = action.payload;
      state.loading = false;
    });
    builder.addCase(createCheckout.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
  },
});

export default checkoutSlice.reducer;
