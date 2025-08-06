import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/shared/navbar/NavBar";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../components/shared/others/ScrollToTop";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [processing, setProcessing] = useState(0);
  const [shipped, setShipped] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (!token) {
      navigate("/login");
    }

    axios
      .get(import.meta.env.VITE_API_URL + `/orders/user/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const ordersData = res.data.orders;
        setOrders(ordersData);
        setProcessing(
          ordersData.filter((order) => order.deliveryStatus === "Pending")
            .length
        );
        setShipped(
          ordersData.filter((order) => order.deliveryStatus === "shipped")
            .length
        );
        setDelivered(
          ordersData.filter((order) => order.deliveryStatus === "delivered")
            .length
        );
      })
      .catch((err) => {
        console.log(err);
        const error = err.response.data;
        showToast(toast, "error", error);
      });
  }, []);

  return (
    <>
      <ScrollToTop />
      <NavBar />
      <div className="w-screen h-screen px-6 py-12 overflow-scroll bg-gray-100">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold">{orders.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <i className="fas fa-shopping-bag text-gold text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Processing</p>
                <h3 className="text-2xl font-bold">{processing}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-blue-500 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Shipped</p>
                <h3 className="text-2xl font-bold">{shipped}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <i className="fas fa-shipping-fast text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Delivered</p>
                <h3 className="text-2xl font-bold">{delivered}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-medium">
                        {order.orderId}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.deliveryStatus === "Pending"
                            ? "bg-blue-50 text-blue-600"
                            : order.deliveryStatus === "shipped"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        <i className="fa-solid fa-circle"></i>{" "}
                        {order.deliveryStatus}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Ordered on {order.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                </div>
                {order.OrderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <img
                      src={
                        import.meta.env.VITE_IMAGE_URL + item.Product?.images[0]
                      }
                      alt={item.Product?.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.Product?.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      {item.birthdayDate && (
                        <p className="text-gray-600 text-sm">
                          Birthday Date: {item.birthdayDate.substring(0, 10)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {/* Delivery details */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <h4 className="font-medium">Delivery Details</h4>
                  <p className="text-gray-600">{order.deliveryName}</p>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                  <p className="text-gray-600">{order.deliveryPhone}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-gray-600">
                    Total Amount:{" "}
                    <span className="font-medium text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const url =
                        import.meta.env.VITE_IMAGE_URL + order.invoiceUrl;
                      console.log("Opening invoice URL:", url);
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    className="px-4 py-2 bg-gold/90 text-white rounded hover:bg-gold transition"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
