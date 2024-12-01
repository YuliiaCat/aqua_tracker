import { createSlice } from "@reduxjs/toolkit";
import { apiLogout, refreshUser, registration } from "./operations";

const INITIAL_STATE = {
  user: {
    // name: null,
    name: "Nadia",

    email: null,
    gender: null,

    // photo: null,
    photo:
      "https://imgcdn.stablediffusionweb.com/2024/3/31/a07c234b-ab97-4ad4-96b1-e1e88ec45e45.jpg",

    waterNorm: null,
    sportHours: null,
    weight: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  error: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(registration.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(registration.fulfilled, (state, action) => {
        const { user, token } = action.payload || {};
        if (user && token) {
          state.user = user;
          state.token = token;
          state.isLoggedIn = true;
        }
        state.isLoading = false;
      })
      .addCase(registration.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(refreshUser.pending, (state) => {
        state.error = null;
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload;
      })

      // Logout user
      .addCase(apiLogout.pending, (state) => {
        state.error = null;
      })
      .addCase(apiLogout.fulfilled, () => {
        return INITIAL_STATE;
      })
      .addCase(apiLogout.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { resetError } = authSlice.actions;
export const authReducer = authSlice.reducer;
