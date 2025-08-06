import React, { useState, useEffect } from "react";
import { getUserOrders } from "../../services/profileService";
import { showToast } from "../shared/others/showToast";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(0);
  const [processing, setProcessing] = useState(0);
  const [shipped, setShipped] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      const ordersData = data.orders;
      setOrders(ordersData);
      setPending(
        ordersData.filter((order) => order.deliveryStatus === "pending").length
      );
      setProcessing(
        ordersData.filter((order) => order.deliveryStatus === "processing")
          .length
      );
      setShipped(
        ordersData.filter((order) => order.deliveryStatus === "shipped").length
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast(toast, "error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-50 text-blue-600";
      case "shipped":
        return "bg-green-50 text-green-600";
      case "delivered":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h2>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-shopping-bag text-white text-2xl"></i>
        </div>
      </div>

      {/* Order Statistics */}
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
              <p className="text-gray-600 mb-1">Pending</p>
              <h3 className="text-2xl font-bold">{pending}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <i className="fas fa-clock text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Processing</p>
              <h3 className="text-2xl font-bold">{processing}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
              <i className="fas fa-gear text-yellow-500 text-xl"></i>
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
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shopping-bag text-gray-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-medium">
                        {order.orderId}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          order.deliveryStatus
                        )}`}
                      >
                        <i className="fa-solid fa-circle"></i>{" "}
                        {order.deliveryStatus}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Ordered on {order.createdAt?.slice(0, 10)}
                    </p>
                    {order.trackingNumber ? (
                      <p className="mt-2 text-gray-600 text-sm flex items-center">
                        <i className="fas fa-truck mr-2 text-blue-500"></i>
                        Tracking:{" "}
                        <span className="font-medium ml-1">
                          {order.trackingNumber}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-2 text-gray-500 text-sm flex items-center">
                        <i className="fas fa-clock mr-2 text-orange-500"></i>
                        Tracking number will be updated soon once we ship your
                        order
                      </p>
                    )}
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
                      <p className="font-medium">
                        {formatCurrency(item.price)}
                      </p>
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
                      {formatCurrency(order.total)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
