import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AdminOrderState, ErrorResponse } from "../../types";

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
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
  },
);

// update order delivery status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async (
    { id, status }: { id: string, status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
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
  },
);

// delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as ErrorResponse);
      }
      return rejectWithValue({ message: "An unknown error occurred" });
    }
  },
);

const initialState: AdminOrderState = {
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.totalOrders = action.payload.length;
      const totalSales = action.payload.reduce(
        (acc: number, order: { totalPrice: number }) => acc + order.totalPrice,
        0,
      );
      state.totalSales = totalSales;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as ErrorResponse)?.message || "Failed to fetch orders";
    });
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false;
      const updatedOrder = action.payload;
      const index = state.orders.findIndex(
        (order) => order._id === updatedOrder._id,
      );
      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as ErrorResponse)?.message ||
        "Failed to update order status";
    });
    builder.addCase(deleteOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload,
      );
    });
    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as ErrorResponse)?.message || "Failed to delete order";
    });
  },
});

export const { clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
