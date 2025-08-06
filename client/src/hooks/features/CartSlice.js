import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items:
      sessionStorage.getItem("products") == null
        ? []
        : JSON.parse(sessionStorage.getItem("products")),
  },
  reducers: {
    addItemsToCart: (state, action) => {
      let item = action.payload;
      const existence = () => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].id === item.id) return true;
        }
        return false;
      };
      if (!existence()) {
        state.items = [...state.items, item];
        sessionStorage.setItem("products", JSON.stringify(state.items));
      } else {
        // If it is a birthday note, set the birthday date with the item
        if (item.SubCategory.name == "Birthday Notes") {
          state.items.forEach((val, index) => {
            if (val.id == item.id) {
              let alteredCart = state.items;
              alteredCart[index].birthdayDate = item.birthdayDate;
              state.items = alteredCart;
              sessionStorage.setItem("products", JSON.stringify(state.items));
            }
          });
          return;
        }
        // If the item already exists, increase the quantity
        state.items.forEach((val, index) => {
          if (val.id == item.id) {
            let alteredCart = state.items;
            alteredCart[index].quantity += item.quantity;
            state.items = alteredCart;
            sessionStorage.setItem("products", JSON.stringify(state.items));
          }
        });
      }
    },
    deleteItemFromCart: (state, action) => {
      const id = action.payload;
      state.items.forEach((val, index) => {
        if (val.id == id) {
          let alteredCart = state.items;
          alteredCart.splice(index, 1);
          // console.log(alteredCart);
          state.items = alteredCart;
          sessionStorage.setItem("products", JSON.stringify(state.items));
        }
      });
    },
    changeQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      state.items.forEach((val, index) => {
        if (val.id == id) {
          let alteredCart = state.items;
          alteredCart[index].quantity = quantity;
          state.items = alteredCart;
          sessionStorage.setItem("products", JSON.stringify(state.items));
        }
      });
    },
    emptyCart: (state, action) => {
      state.items = [];
      sessionStorage.setItem("products", JSON.stringify(state.items));
    },
  },
});

// Action creators are generated for each case reducer function
export const { addItemsToCart, deleteItemFromCart, changeQuantity, emptyCart } =
  cartSlice.actions;

export default cartSlice.reducer;
