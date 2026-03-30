import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AdminProductState, Product } from "../../types";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const response = await axios.get(`${API_URL}/api/admin/products`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  },
);

// async thunk function to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData) => {
    const response = await axios.post(
      `${API_URL}/api/admin/products`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      },
    );
    return response.data;
  },
);

// async thunk function to update a product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }: { id: string; productData: unknown }) => {
    const response = await axios.put(
      `${API_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      },
    );
    return response.data;
  },
);

// async thunk function to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id: string) => {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return id;
  },
);

const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAdminProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAdminProducts.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (product: Product) => product._id === updatedProduct._id,
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product._id !== action.payload,
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
  },
});

export default adminProductSlice.reducer;
