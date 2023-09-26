import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface cartState {
  cart: {
    cartId?: string;
    userId?: string;
    classId?: string;
    className?: string;
    classImage?: string;
    price?: number;
    quantity?: number;
    total?: number;
  };
  loading: boolean;
  error: string | boolean;
}

const initialState: cartState = {
  cart: {},
  loading: false,
  error: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get cart:
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.cart = action.payload[0];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "";
      })
      //Add to cart:
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "";
      })
      //CheckOut:
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.cart = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "";
      })
      //Reset error:
      .addCase(resetStatus.fulfilled, (state) => {
        state.error = "";
        state.loading = false;
      });
  },
});

//Get cart:
export const getCart = createAsyncThunk(
  "cart/getCart",
  async ({ userId }: { userId: string }) => {
    console.log("userId from redux", userId);

    try {
      const response = await axios.get(`http://localhost:8800/cart/${userId}`);
      console.log("response from redux", response.data.data);

      return response.data.data;
    } catch (error: any) {
      console.log("error from redux", error.response.data.message);

      throw new Error(error.response.data.message);
    }
  }
);

//Add to cart:
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, classId }: { userId: string; classId: string }) => {
    try {
      const response = await axios.post(
        `http://localhost:8800/cart/addToCart`,
        { userId, classId }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
);
//Check out:
export const checkOut = createAsyncThunk(
  "cart/checkOut",
  async (cart: cartState) => {
    try {
      const response = await axios.post(
        `http://localhost:8800/cart/checkOut`,
        cart
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
);

export const resetStatus = createAsyncThunk("resetStatus", () => {
  return;
});

export default cartSlice.reducer;
