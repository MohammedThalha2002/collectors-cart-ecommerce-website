import axios from "axios";

export function placeOrder(
  products,
  transactionID,
  paymentMethod,
  deliveryName,
  deliveryPhone,
  deliveryAddress,
  onSuccess,
  onFailure
) {
  const data = {
    paymentId: transactionID,
    paymentMethod: paymentMethod,
    items: products,
    deliveryName: deliveryName,
    deliveryPhone: deliveryPhone,
    deliveryAddress: deliveryAddress,
  };

  const token = localStorage.getItem("jwt-token");
  if (!token) {
    return;
  }

  axios
    .post(import.meta.env.VITE_API_URL + `/order`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // Pass the generated orderId from backend to the success callback
      onSuccess(response.data.orderId);
    })
    .catch((err) => {
      console.log(err);
      const error = err.response?.data?.message || "Failed to place order";
      onFailure(error);
    });
}
