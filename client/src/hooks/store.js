import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import CartReducer from "./features/CartSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: CartReducer,
  },
});
