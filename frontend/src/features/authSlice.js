import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  isadmin: JSON.parse(localStorage.getItem("isadmin")) || false,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    verifylogin(state) {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", true);
    },
    verifylogout(state) {
      state.isLoggedIn = false;
      localStorage.setItem("isLoggedIn", false);
      state.isadmin = false;
      localStorage.setItem("isadmin",false);
    },
    verifyadmin(state, action) {
      const email = action.payload;
      const isAdmin = email.endsWith('@admin.com');
      state.isadmin = isAdmin;
      localStorage.setItem("isadmin", JSON.stringify(isAdmin));
    },
  },
});

export const { verifylogin, verifylogout, verifyadmin } = authSlice.actions;
export default authSlice.reducer;