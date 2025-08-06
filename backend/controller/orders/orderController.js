import Order from "../../model/order.js";
import OrderItem from "../../model/orderItem.js";
import User from "../../model/user.js";
import Product from "../../model/product.js";
import Queue from "bull";
import { generateInvoice } from "./invoiceController.js";
import ExcelJS from "exceljs";
import { Op } from "sequelize";
import redisClient from "../../config/redis.js";
import admin from "../../config/firebase.js";
import { sendOrderMail } from "../mailer/mailController.js";

const orderQueue = new Queue("orderQueue", {
  redis: { host: "localhost", port: 6379 },
});

/**
 * Generate the next sequential order ID
 */
const generateOrderId = async () => {
  try {
    // Get the latest order by ID to find the highest sequence number
    const latestOrder = await Order.findOne({
      order: [["id", "DESC"]],
      attributes: ["orderId"],
    });

    let sequenceNumber = 1;

    if (latestOrder && latestOrder.orderId) {
      // Extract the sequence number from the latest orderId (format: ORD000001)
      const match = latestOrder.orderId.match(/^ORD(\d{6})$/);
      if (match) {
        sequenceNumber = parseInt(match[1]) + 1;
      }
    }

    // Format as 6-digit number with leading zeros
    const formattedSequence = sequenceNumber.toString().padStart(6, "0");
    return `ORD${formattedSequence}`;
  } catch (error) {
    console.error("Error generating order ID:", error);
    // Fallback to timestamp-based ID if database query fails
    const timestamp = Date.now().toString().slice(-6);
    return `ORD${timestamp}`;
  }
};

/**
 * Create a new order along with its order items.
 * Expected request body:
 * {
 *   orderId: "ORD12345",
 *   paymentId: "PAY98765",
 *   deliveryStatus: "Pending",
 *   items: [
 *     { productId: 2, quantity: 3, price: 100 },
 *     { productId: 4, quantity: 2, price: 600 }
 *   ],
 *  deliveryName: "John Doe",
 *  deliveryPhone: "1234567890",
 *  deliveryAddress: "123 Main St, City, State - 123456"
 * }
 */
export const addOrder = async (req, res) => {
  try {
    // Check if the Redis connection is open
    if (!redisClient.isOpen) {
      throw new Error("Redis connection is not open");
    }

    // Generate sequential order ID
    const orderId = await generateOrderId();

    const data = {
      orderId: orderId,
      paymentId: req.body.paymentId,
      paymentMethod: req.body.paymentMethod,
      userId: req.user.id,
      items: req.body.items,
      deliveryName: req.body.deliveryName,
      deliveryPhone: req.body.deliveryPhone,
      deliveryAddress: req.body.deliveryAddress,
    };

    // only admin can add the discount
    if (req.user.role === "super-admin" || req.user.role === "admin") {
      data.discount = req.body.discount || 0;
      data.userId = req.body.userId;
    } else {
      data.discount = 0; // regular users cannot add discount
    }

    // Check if the items array is not empty
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({ message: "Order items cannot be empty" });
    }

    // Check if the user exists
    const user = await User.findByPk(data.userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Calculate the total price of the order
    let total = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
    const shippingCost = total >= 2500 ? 0 : 70;
    total += shippingCost - data.discount;
    data.total = total;

    // Create the order record
    const order = await Order.create(data);

    // If there are order items, create them
    if (data.items && Array.isArray(data.items)) {
      const orderItemsData = data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        birthdayDate: item.birthdayDate || null,
      }));

      // Bulk create order items for the order
      await OrderItem.bulkCreate(orderItemsData);
    }

    // Add the order to the queue for processing
    await orderQueue.add({
      order: data,
      user: user,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: order,
      orderId: orderId, // Include the generated order ID in response
    });
  } catch (error) {
    console.error("Error in addOrder:", error.message);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

/**
 * Retrieve all orders.
 * Includes associated order items (with Product details) and the User who placed the order.
 */
export const getOrders = async (req, res) => {
  const match = {};
  const sort = [];

  // Filtering
  if (req.query.deliveryStatus) {
    match.deliveryStatus = req.query.deliveryStatus;
  }

  // Sort by created date - ASC or DESC
  if (req.query.sort) {
    const sort = req.query.sort;
    sort.push(["createdAt", sort]);
  }

  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.findAll({
      where: match,
      offset: offset,
      order: sort.length ? sort : [["createdAt", "DESC"]],
      limit: limit,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "images"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
    });

    const total = await Order.count({ where: match });
    const meta = {
      total: total,
      limit: limit,
      offset: offset,
      page: offset / limit + 1,
    };

    const output = {
      data: orders,
      meta: meta,
    };
    res.status(200).send(output);
  } catch (error) {
    console.error("Error in getOrders:", error);
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "images"], // Only select these attributes
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "email"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ message: "Failed to retrieve order", error });
  }
};

/**
 * Retrieve orders for a specific user.
 * Expects user id in req.params.userId.
 */
export const getOrdersByUsers = async (req, res) => {
  try {
    const userId = req.user.id; // Use the logged-in user's id from the token

    const orders = await Order.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getOrdersByUsers:", error);
    res.status(500).json({ message: "Failed to retrieve user orders", error });
  }
};

/**
 * Update the delivery status of an order.
 * Expects order id in req.params.id and new delivery_status in req.body.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryStatus = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// Update Tracking number of an order
export const updateTrackingNumber = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { trackingNumber } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.trackingNumber = trackingNumber;
    await order.save();

    res.status(200).json({
      message: "Tracking number updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in updateTrackingNumber:", error);
    res
      .status(500)
      .json({ message: "Failed to update tracking number", error });
  }
};

/**
 * Delete an order by its id.
 * Cascading deletion will remove associated order items as well.
 * Expects order id in req.params.id.
 */
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.destroy(); // onDelete cascade will remove associated OrderItems

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

/**
 * Exports all orders (and their items) to an Excel file
 * according to the query params ?start=YYYY-MM-DD &end=YYYY-MM-DD
 * If no date is provided, defaults to the current month.
 */
export const exportOrdersToExcel = async (req, res) => {
  try {
    const { start, end } = req.query;
    let startDate, endDate;

    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }

    const orders = await Order.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: User,
          attributes: ["name", "phone", "address", "city", "state", "pincode"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 15 },
      { header: "Payment ID", key: "paymentId", width: 20 },
      { header: "Delivery Status", key: "deliveryStatus", width: 20 },
      { header: "Customer Name", key: "deliveryName", width: 20 },
      { header: "Customer Phone", key: "deliveryPhone", width: 20 },
      { header: "Customer Address", key: "deliveryAddress", width: 30 },
      { header: "Ordered Date", key: "orderedDate", width: 20 },
      { header: "Total", key: "total", width: 10 },
    ];

    for (const order of orders) {
      const orderDate = `${order.createdAt.getDate()}/${
        order.createdAt.getMonth() + 1
      }/${order.createdAt.getFullYear()}`;
      const address = order.user
        ? `${order.user.address}, ${order.user.city}, ${order.user.state} - ${order.user.pincode}`
        : "N/A";
      const data = {
        orderId: order.orderId,
        paymentId: order.paymentId,
        orderedDate: orderDate,
        total: order.total,
        deliveryStatus: order.deliveryStatus,
        deliveryName: order.deliveryName,
        deliveryPhone: order.deliveryPhone,
        deliveryAddress: address,
      };
      worksheet.addRow(data);
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=orders_${Date.now()}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Error exporting orders:", error);
    return res.status(500).json({ message: "Failed to export orders", error });
  }
};

const processOrder = async (job) => {
  console.log("Processing order:");

  const order = job.data.order;
  const user = job.data.user;
  let subTotal = 0;
  let totalGST = 0;
  let total = 0;

  // step 1 : For each order item, get the prduct name and add it to the order item
  //  and then update the inStock quantity of the product
  for (const item of order.items) {
    const product = await Product.findByPk(item.productId);

    if (!product) {
      console.error("Product not found for id:", item.productId);
      continue;
    }

    item.name = product.name;
    item.gst = product.gst;
    const gstAmount = ((item.price * product.gst) / 100) * item.quantity;
    subTotal += item.quantity * item.price - gstAmount;
    totalGST += gstAmount;
    total += item.quantity * item.price;
    item.totalPrice = item.quantity * item.price;

    // Update the inStock quantity of the product
    await product.decrement("inStock", { by: item.quantity });
    await product.save();
  }

  const shippingCost = subTotal >= 2500 ? 0 : 70;
  total += shippingCost - order.discount;

  // step 2: Invoice creation
  const invoiceData = {
    orderId: order.orderId,
    name: order.deliveryName,
    email: user.email,
    phone: order.deliveryPhone,
    address: order.deliveryAddress,
    items: order.items,
    transactionId: order.paymentId,
    paymentMethod: order.paymentMethod,
    subtotal: subTotal,
    discount: order.discount,
    halfGST: totalGST / 2,
    shipping: shippingCost,
    totalAmount: total,
    totalGST: totalGST,
  };
  console.log(invoiceData);

  const invoice = await generateInvoice(invoiceData);

  console.log("Invoice created successfully", invoice);

  // step 3: Update the invoice url in the order record
  try {
    const updatedOrder = await Order.findOne({
      where: { orderId: order.orderId },
    });
    updatedOrder.invoiceUrl = invoice.url;
    await updatedOrder.save();

    console.log("Invoice url updated in order");
  } catch (error) {
    console.log("Error updating invoice url in order:", error);
  }

  try {
    await sendOrderMail(invoiceData);
    console.log("Order email sent successfully");
  } catch (error) {
    console.error("Error sending order email:", error);
  }

  // const payload = {
  //   notification: {
  //     title: "Order Placed 📦",
  //     body: "New order has been placed by " + order.deliveryName,
  //   },
  //   topic: "admins",
  // };

  // admin
  //   .messaging()
  //   .send(payload)
  //   .then((response) => {
  //     console.log("Order Notification sent successfully:", response);
  //   })
  //   .catch((error) => {
  //     console.error("Error sending notification:", error);
  //   });

  // // check for low stock products and if exists send a notification to admins
  // const lowStockProducts = await Product.findAll({
  //   where: {
  //     inStock: {
  //       [Op.lt]: 2, // Assuming low stock is defined as less than 2 items
  //     },
  //   },
  // });

  // // Send the product names in the notification
  // const productNames = lowStockProducts
  //   .map((product) => product.name)
  //   .join(", ");

  // if (lowStockProducts.length > 0) {
  //   const payload = {
  //     notification: {
  //       title: "Low Stock Alert 🚨",
  //       body:
  //         "The following products are running low on stock: " + productNames,
  //     },
  //     topic: "admins",
  //   };

  //   admin
  //     .messaging()
  //     .send(payload)
  //     .then((response) => {
  //       console.log("Low stock Notification sent successfully:", response);
  //     })
  //     .catch((error) => {
  //       console.error("Error sending notification:", error);
  //     });
  // }
};

orderQueue.process(processOrder);
