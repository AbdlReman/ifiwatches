import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import { getQuantityDiscount, getQuantityDiscountedPrice } from "../../helpers/product";
const { createSlice } = require("@reduxjs/toolkit");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const suppressToast = action.payload?.suppressToast || false;
      
      // Calculate quantity discount
      const quantity = product.quantity ? product.quantity : 1;
      const quantityDiscount = getQuantityDiscount(quantity);
      
      if (!product.variation) {
        const cartItem = state.cartItems.find((item) => item.id === product.id);
        if (!cartItem) {
          state.cartItems.push({
            ...product,
            quantity: quantity,
            quantityDiscount: quantityDiscount,
            cartItemId: uuidv4(),
          });
          if (!suppressToast) {
            toast.success("Added to cart successfully!");
          }
        } else {
          state.cartItems = state.cartItems.map((item) => {
            if (item.cartItemId === cartItem.cartItemId) {
              const newQuantity = product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1;
              return {
                ...item,
                quantity: newQuantity,
                quantityDiscount: getQuantityDiscount(newQuantity),
              };
            }
            return item;
          });
          if (!suppressToast) {
            toast.success("Quantity updated in cart!");
          }
        }
      } else {
        const cartItem = state.cartItems.find(
          (item) =>
            item.id === product.id &&
            product.selectedProductColor &&
            product.selectedProductColor === item.selectedProductColor &&
            product.selectedProductSize &&
            product.selectedProductSize === item.selectedProductSize &&
            (product.cartItemId ? product.cartItemId === item.cartItemId : true)
        );
        if (!cartItem) {
          state.cartItems.push({
            ...product,
            quantity: quantity,
            quantityDiscount: quantityDiscount,
            cartItemId: uuidv4(),
          });
          if (!suppressToast) {
            toast.success("Added to cart successfully!");
          }
        } else if (
          cartItem !== undefined &&
          (cartItem.selectedProductColor !== product.selectedProductColor ||
            cartItem.selectedProductSize !== product.selectedProductSize)
        ) {
          state.cartItems = [
            ...state.cartItems,
            {
              ...product,
              quantity: quantity,
              quantityDiscount: quantityDiscount,
              cartItemId: uuidv4(),
            },
          ];
          if (!suppressToast) {
            toast.success("Added to cart successfully!");
          }
        } else {
          state.cartItems = state.cartItems.map((item) => {
            if (item.cartItemId === cartItem.cartItemId) {
              const newQuantity = product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1;
              return {
                ...item,
                quantity: newQuantity,
                quantityDiscount: getQuantityDiscount(newQuantity),
                selectedProductColor: product.selectedProductColor,
                selectedProductSize: product.selectedProductSize,
              };
            }
            return item;
          });
          if (!suppressToast) {
            toast.success("Quantity updated in cart!");
          }
        }
      }
    },
    deleteFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== action.payload
      );
      toast.error("Removed from cart successfully!");
    },
    decreaseQuantity(state, action) {
      const product = action.payload;
      if (product.quantity === 1) {
        state.cartItems = state.cartItems.filter(
          (item) => item.cartItemId !== product.cartItemId
        );
      } else {
        state.cartItems = state.cartItems.map((item) =>
          item.cartItemId === product.cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    },
    updateQuantity(state, action) {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        state.cartItems = state.cartItems.filter(
          (item) => item.cartItemId !== cartItemId
        );
        toast.error("Item removed from cart!");
      } else {
        state.cartItems = state.cartItems.map((item) =>
          item.cartItemId === cartItemId
            ? { 
                ...item, 
                quantity: quantity,
                quantityDiscount: getQuantityDiscount(quantity)
              }
            : item
        );
        toast.success("Quantity updated successfully!");
      }
    },
    deleteAllFromCart(state, action) {
      state.cartItems = [];
      // Only show toast if not silent (for checkout process)
      if (!action.payload?.silent) {
        toast.success("Cart cleared successfully!");
      }
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  decreaseQuantity,
  updateQuantity,
  deleteAllFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
