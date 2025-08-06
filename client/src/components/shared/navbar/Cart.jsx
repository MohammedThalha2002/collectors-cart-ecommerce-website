import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  changeQuantity,
  deleteItemFromCart,
} from "../../../hooks/features/CartSlice";
import FreeShippingProgress from "./FreeShippingProgress";

function Cart({ open, setOpen }) {
  const products = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function changingQuantity(product, action) {
    let quantity = product.quantity;
    if (action === "add") {
      quantity++;
    } else {
      quantity = Math.max(1, quantity - 1);
    }
    dispatch(changeQuantity({ id: product.id, quantity }));
  }

  const total = calculateTotal(products);

  return (
    <>
      {/* Optional semi-transparent background overlay */}
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Cart panel */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full max-w-md bg-white z-50
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-300">
          <h2 className="text-black text-xl font-semibold">Shopping Cart</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-black"
            onClick={() => setOpen(false)}
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="divide-y divide-gray-300">
            {products.map((product) => (
              <li key={product.id} className="flex py-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={import.meta.env.VITE_IMAGE_URL + product?.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col text-black">
                  <div className="flex justify-between font-medium">
                    <h3>{product.name}</h3>
                    <p className="ml-4">₹{product.sellingPrice}</p>
                  </div>
                  {product.birthdayDate && (
                    <p className="text-xs text-gray-500">
                      Date: {product.birthdayDate}
                    </p>
                  )}
                  <div className="flex items-end justify-between mt-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => changingQuantity(product, "sub")}
                        className="h-6 w-6 rounded-full bg-gold text-white text-xs"
                      >
                        <i className="fa-solid fa-minus" />
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => changingQuantity(product, "add")}
                        className="h-6 w-6 rounded-full bg-gold text-white text-xs"
                      >
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-gold hover:text-gold/80 border border-transparent px-2 py-1 rounded"
                      onClick={() => dispatch(deleteItemFromCart(product.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 px-4 py-6 text-black">
          <div className="flex justify-between text-base font-medium">
            <p>Subtotal</p>
            <p>₹{total}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          {products.length > 0 && <FreeShippingProgress subtotal={total} />}
          <div className="mt-6">
            <button
              disabled={products.length === 0}
              type="button"
              onClick={() => {
                if (products.length > 0) {
                  if (localStorage.getItem("jwt-token")) {
                    navigate("/checkout");
                  } else {
                    navigate("/login");
                  }
                }
              }}
              className="flex w-full items-center justify-center rounded-md bg-gold px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
          <div className="mt-6 flex justify-center text-sm">
            <p>
              or{" "}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-1 text-gold hover:text-gold/80 border border-transparent"
              >
                Continue Shopping →
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function calculateTotal(products) {
  return products.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );
}

export default Cart;
