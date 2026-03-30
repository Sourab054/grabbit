import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AdminState, User } from "../../types";

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
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
});

// Add the create user action
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
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

// Update user action (admin only)
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (
    {
      id,
      name,
      email,
      role,
    }: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role },
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

// Delete a user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null as string | null,
  } as AdminState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
    builder.addCase(addUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const updatedUser = action.payload;
      const index = state.users.findIndex(
        (user: User) => user._id === updatedUser._id,
      );
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error =
        (typeof action.payload === "string"
          ? action.payload
          : (action.payload as { message?: string })?.message) ??
        "An unexpected error occurred";
      state.loading = false;
    });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
