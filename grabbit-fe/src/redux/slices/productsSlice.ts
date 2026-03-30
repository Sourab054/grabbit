import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { ProductsState } from "../../types";

// Async Thunk to Fetch Products by Collection and optional Filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }: {
    collection?: string;
    size?: string;
    color?: string;
    gender?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    search?: string;
    category?: string;
    material?: string;
    brand?: string;
    limit?: string;
  }) => {
    try {
      const query = new URLSearchParams();

      if (collection) query.append("collection", collection);
      if (size) query.append("size", size);
      if (color) query.append("color", color);
      if (gender) query.append("gender", gender);
      if (minPrice) query.append("minPrice", minPrice);
      if (maxPrice) query.append("maxPrice", maxPrice);
      if (sortBy) query.append("sortBy", sortBy);
      if (search) query.append("search", search);
      if (category) query.append("category", category);
      if (material) query.append("material", material);
      if (brand) query.append("brand", brand);
      if (limit) query.append("limit", limit);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
);

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
    );
    return response.data;
  },
);

// Async thunk to fetch similar products by ID
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`,
    );
    return response.data;
  },
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }: { id: string; productData: unknown }) => {
    const token = localStorage.getItem("userToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers,
      },
    );
    return response.data;
  },
);

const initialState: ProductsState = {
  products: [],
  selectedProduct: null, // Store the details of the selected product
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    collection: "",
    brand: "",
    maxPrice: "",
    minPrice: "",
    sortBy: "",
    search: "",
    material: "",
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        collection: "",
        brand: "",
        maxPrice: "",
        minPrice: "",
        sortBy: "",
        search: "",
        material: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsByFilters.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductsByFilters.fulfilled, (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    });
    builder.addCase(fetchProductsByFilters.rejected, (state, action) => {
      state.error = action.error.message || "Failed to fetch products";
      state.loading = false;
    });
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.selectedProduct = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.error = action.error.message || "Failed to fetch product details";
      state.loading = false;
    });
    builder.addCase(fetchSimilarProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSimilarProducts.fulfilled, (state, action) => {
      state.similarProducts = Array.isArray(action.payload)
        ? action.payload
        : [];
      state.loading = false;
    });
    builder.addCase(fetchSimilarProducts.rejected, (state, action) => {
      state.error = action.error.message || "Failed to fetch similar products";
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
        (product) => product._id === updatedProduct._id,
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.error = action.error.message || "Failed to update product";
      state.loading = false;
    });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
