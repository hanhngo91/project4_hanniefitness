import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface State {
  currentUser: {
    userName?: string;
    email?: string;
    userId?: string;
    token?: string;
    roles?: number;
  };
  loading: boolean;
  error: string | boolean | null;
}
const initialState: State = {
  currentUser: {},
  loading: false,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Log in:
      .addCase(loginRedux.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginRedux.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.currentUser = action.payload;
      })
      .addCase(loginRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      //Register:
      .addCase(registerRedux.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(registerRedux.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.currentUser = action.payload;
      })
      .addCase(registerRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(resetStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(logoutRedux.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.currentUser = {};
      });
  },
});
//Log in:
export const loginRedux = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const result = await axios.post(
        "http://localhost:8800/data/users/login",
        {
          email,
          password,
        }
      );
      return result.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
);
//Register:
export const registerRedux = createAsyncThunk(
  "auth/register",
  async ({
    userName,
    email,
    password,
  }: {
    userName: string;
    email: string;
    password: string;
  }) => {
    try {
      const result = await axios.post(
        "http://localhost:8800/data/users/signup",
        {
          userName,
          email,
          password,
        }
      );
      return result.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
);

//Reset status:
export const resetStatus = createAsyncThunk("resetStatus", () => {
  return;
});

//Logout:
export const logoutRedux = createAsyncThunk("logoutRedux", () => {
  return;
});

export default authSlice.reducer;
