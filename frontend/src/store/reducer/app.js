import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: undefined,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = undefined;
    },
  },
});

export const { setToken, clearToken } = appSlice.actions;

export default appSlice.reducer;
