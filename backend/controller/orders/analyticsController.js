import { Op } from "sequelize";
import Sequelize from "../../config/db.js";
import Order from "../../model/order.js";
import OrderItem from "../../model/orderItem.js";
import Product from "../../model/product.js";
import Category from "../../model/category.js";
import SubCategory from "../../model/subCategory.js";

// 1. Weekly sales report
// 2. Montly sales report
// 3. Yearly sales report
// 4. Frequently purchased products

export const weeklySalesReport = async (req, res) => {
  try {
    // 1. Identify the Sunday of the current week
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
    const sunday = new Date(today);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(sunday.getDate() - dayOfWeek);

    // 2. Identify the Saturday of the same week
    const saturday = new Date(sunday);
    saturday.setDate(saturday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    // 3. Use getOrderAnalytics, which now returns dailyData, totalEarned, totalProfit
    const analytics = await getOrderAnalytics(sunday, saturday);

    // Convert dailyData (array) into a map keyed by dateStr for quick access
    const dailyMap = analytics.dailyData.reduce((acc, day) => {
      acc[day.date] = day;
      return acc;
    }, {});

    // 4. Build the array [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
    const weeklySales = [];

    for (let i = 0; i < 7; i++) {
      const curr = new Date(sunday);
      curr.setDate(sunday.getDate() + i);
      const key = curr.toDateString();

      weeklySales.push({
        date: key,
        totalOrders: dailyMap[key]?.orderCount || 0,
        totalEarned: dailyMap[key]?.dayProfit || 0,
        totalProfit: dailyMap[key]?.dayEarned || 0,
      });
    }

    // convert the analytics.salesByCategory and analytics.salesBySubCategory to arrays
    const salesByCategory = Object.entries(analytics.salesByCategory).map(
      ([name, total]) => ({ name, total })
    );
    const salesBySubCategory = Object.entries(analytics.salesBySubCategory).map(
      ([name, total]) => ({ name, total })
    );

    return res.json({
      sales: weeklySales,
      totalOrders: analytics.totalOrders,
      totalEarned: analytics.totalEarned,
      totalProfit: analytics.totalProfit,
      highestOrder: analytics.highestOrder,
      lowestOrder: analytics.lowestOrder,
      averageOrderSales: analytics.averageOrderSales,
      salesByCategory: salesByCategory,
      salesBySubCategory: salesBySubCategory,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const monthlySalesReport = async (req, res) => {
  try {
    // 1. Check if a month parameter was provided; default to current month if not provided or invalid.
    const { month } = req.query;
    const parsedMonth = parseInt(month, 10);
    const today = new Date();
    const currentYear = today.getFullYear();

    // If month is valid (1 through 12), use it; otherwise, use the current month (getMonth() + 1).
    const targetMonth =
      parsedMonth >= 1 && parsedMonth <= 12
        ? parsedMonth - 1
        : today.getMonth();

    // 2. Determine the first and last day of the chosen month
    const firstDayOfMonth = new Date(currentYear, targetMonth, 1);
    const lastDayOfMonth = new Date(currentYear, targetMonth + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    // 3. Use your existing function to get analytics
    const analytics = await getOrderAnalytics(firstDayOfMonth, lastDayOfMonth);

    // 4. Convert dailyData array to a map keyed by dateStr
    const dailyMap = analytics.dailyData.reduce((acc, day) => {
      acc[day.date] = day;
      return acc;
    }, {});

    // 5. Build the array for each day in the month
    const daysInMonth = lastDayOfMonth.getDate();
    const monthlySales = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(currentYear, targetMonth, i);
      const key = currDate.toDateString();
      monthlySales.push({
        date: key,
        totalOrders: dailyMap[key]?.orderCount || 0,
        totalEarned: dailyMap[key]?.dayProfit || 0,
        totalProfit: dailyMap[key]?.dayEarned || 0,
      });
    }

    const salesByCategory = Object.entries(analytics.salesByCategory).map(
      ([name, total]) => ({ name, total })
    );
    const salesBySubCategory = Object.entries(analytics.salesBySubCategory).map(
      ([name, total]) => ({ name, total })
    );

    return res.json({
      sales: monthlySales,
      totalOrders: analytics.totalOrders,
      totalEarned: analytics.totalEarned,
      totalProfit: analytics.totalProfit,
      highestOrder: analytics.highestOrder,
      lowestOrder: analytics.lowestOrder,
      averageOrderSales: analytics.averageOrderSales,
      salesByCategory: salesByCategory,
      salesBySubCategory: salesBySubCategory,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const yearlySalesReport = async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();

    const monthlyData = [];

    let totalOrdersInYear = 0;
    let totalEarnedInYear = 0;
    let totalProfitInYear = 0;

    // For tracking year-wide highest and lowest single-order totals
    let yearHighestOrderTotal = 0;
    let yearHighestOrderDate = null;
    let yearLowestOrderTotal = Number.MAX_VALUE;
    let yearLowestOrderDate = null;

    // Loop through each month, 0 = January, 11 = December
    for (let month = 0; month < 12; month++) {
      // ...existing code...
      const startOfMonth = new Date(currentYear, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);

      const analytics = await getOrderAnalytics(startOfMonth, endOfMonth);

      const monthlyOrders = analytics.dailyData.reduce(
        (acc, dayObj) => acc + (dayObj.orderCount || 0),
        0
      );

      totalOrdersInYear += monthlyOrders;
      totalEarnedInYear += analytics.totalEarned || 0;
      totalProfitInYear += analytics.totalProfit || 0;

      if (analytics.highestOrder.total > yearHighestOrderTotal) {
        yearHighestOrderTotal = analytics.highestOrder.total;
        yearHighestOrderDate = analytics.highestOrder.date;
      }
      if (
        analytics.lowestOrder.total < yearLowestOrderTotal &&
        analytics.lowestOrder.total !== 0
      ) {
        yearLowestOrderTotal = analytics.lowestOrder.total;
        yearLowestOrderDate = analytics.lowestOrder.date;
      }

      monthlyData.push({
        date: startOfMonth.toDateString(),
        totalOrders: monthlyOrders,
        totalEarned: analytics.totalEarned,
        totalProfit: analytics.totalProfit,
      });
      // ...existing code...
    }

    // Call getOrderAnalytics for the entire year to determine top category info
    const yearStart = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const yearAnalytics = await getOrderAnalytics(yearStart, yearEnd);

    // Compute average order sales across the entire year
    const averageOrderSalesInYear = totalOrdersInYear
      ? parseFloat((totalEarnedInYear / totalOrdersInYear).toFixed(2))
      : 0;

    if (yearLowestOrderTotal === Number.MAX_VALUE) {
      yearLowestOrderTotal = 0;
    }

    const salesByCategory = Object.entries(yearAnalytics.salesByCategory).map(
      ([name, total]) => ({ name, total })
    );
    const salesBySubCategory = Object.entries(
      yearAnalytics.salesBySubCategory
    ).map(([name, total]) => ({ name, total }));

    return res.json({
      sales: monthlyData,
      totalOrders: totalOrdersInYear,
      totalEarned: totalEarnedInYear,
      totalProfit: totalProfitInYear,
      averageOrderSales: averageOrderSalesInYear,
      highestOrder: {
        total: yearHighestOrderTotal,
        date: yearHighestOrderDate,
      },
      lowestOrder: {
        total: yearLowestOrderTotal,
        date: yearLowestOrderDate,
      },
      salesByCategory: salesByCategory,
      salesBySubCategory: salesBySubCategory,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const weeklySalesIncrease = async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
    const sunday = new Date(today);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(sunday.getDate() - dayOfWeek);

    // Get the previous week's Sunday
    const lastSunday = new Date(sunday);
    lastSunday.setDate(lastSunday.getDate() - 7);

    // Get the current week's Saturday
    const saturday = new Date(sunday);
    saturday.setDate(saturday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    // Get the previous week's Saturday
    const lastSaturday = new Date(saturday);
    lastSaturday.setDate(lastSaturday.getDate() - 7);

    // Use getOrderAnalytics for both weeks
    const currentWeekAnalytics = await getOrderAnalytics(sunday, saturday);
    const lastWeekAnalytics = await getOrderAnalytics(lastSunday, lastSaturday);

    const salesPercentageChange = parseFloat(
      (
        ((currentWeekAnalytics.totalEarned - lastWeekAnalytics.totalEarned) /
          lastWeekAnalytics.totalEarned) *
        100
      ).toFixed(2)
    );

    return res.json({
      percentage: salesPercentageChange,
      sales: currentWeekAnalytics.totalEarned,
      profit: currentWeekAnalytics.totalProfit,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// This function retrieves analytics data within the given date range
const getOrderAnalytics = async (startDate, endDate) => {
  // 1) Get daily order counts
  const dailyCounts = await Order.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "orderDate"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "orderCount"],
    ],
    where: {
      createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
    },
    group: ["orderDate"],
    raw: true,
  });

  // 2) Overall total earned
  const totalData = await Order.findOne({
    attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "totalEarned"]],
    where: {
      createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
    },
    raw: true,
  });
  const totalEarned = parseFloat(totalData.totalEarned || 0);

  // 3) Prepare dailySummary
  const dailySummary = {};
  dailyCounts.forEach((row) => {
    const dateStr = new Date(row.orderDate).toDateString();
    dailySummary[dateStr] = {
      date: dateStr,
      orderCount: parseInt(row.orderCount, 10) || 0,
      dayProfit: 0,
      dayEarned: 0,
    };
  });

  // 4) Load orders and include Category, SubCategory for top picks
  const orders = await Order.findAll({
    where: {
      createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
    },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product,
            include: [Category, SubCategory],
          },
        ],
      },
    ],
  });

  let totalProfit = 0;
  let maxOrderTotal = 0;
  let maxOrderDate = null;
  let minOrderTotal = Number.MAX_VALUE;
  let minOrderDate = null;

  const categoryCountMap = {};
  const subCategoryCountMap = {};

  for (const order of orders) {
    const dateStr = new Date(order.createdAt).toDateString();
    if (!dailySummary[dateStr]) {
      dailySummary[dateStr] = {
        date: dateStr,
        orderCount: 0,
        dayProfit: 0,
        dayEarned: 0,
      };
    }

    let orderProfit = 0;
    for (const item of order.OrderItems) {
      const costPrice = item.Product.costPrice || 0;
      const sellingPrice = item.price || 0;
      const quantity = item.quantity || 0;
      orderProfit += (sellingPrice - costPrice) * quantity;

      // Track category purchases
      const catName = item.Product.Category?.name || "Uncategorized";
      categoryCountMap[catName] = (categoryCountMap[catName] || 0) + quantity;

      // Track subCategory purchases
      const subCatName = item.Product.SubCategory?.name;
      if (subCatName) {
        subCategoryCountMap[subCatName] =
          (subCategoryCountMap[subCatName] || 0) + quantity;
      }
    }

    orderProfit -= order.discount || 0;
    dailySummary[dateStr].dayProfit += orderProfit;
    dailySummary[dateStr].dayEarned += order.total || 0;
    totalProfit += orderProfit;

    // Highest / lowest single-order totals
    if (order.total > maxOrderTotal) {
      maxOrderTotal = order.total;
      maxOrderDate = order.createdAt;
    }
    if (order.total < minOrderTotal) {
      minOrderTotal = order.total;
      minOrderDate = order.createdAt;
    }
  }

  // 5) Convert dailySummary to array
  const dailyData = Object.values(dailySummary);

  // Average order sales
  const averageOrderSales = parseFloat(
    (orders.length ? totalEarned / orders.length : 0).toFixed(2)
  );

  return {
    dailyData,
    totalEarned,
    totalProfit,
    totalOrders: orders.length,
    highestOrder: {
      total: maxOrderTotal,
      date: maxOrderDate ? new Date(maxOrderDate).toDateString() : null,
    },
    lowestOrder: {
      total: minOrderTotal === Number.MAX_VALUE ? 0 : minOrderTotal,
      date: minOrderDate ? new Date(minOrderDate).toDateString() : null,
    },
    averageOrderSales,
    salesByCategory: categoryCountMap,
    salesBySubCategory: subCategoryCountMap,
  };
};

export const frequentlyPurchasedProducts = async (req, res) => {
  try {
    // Find top-selling products by summing quantity from OrderItems
    const items = await OrderItem.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalQuantitySold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["name", "description", "images", "sellingPrice"],
        },
      ],
      group: ["productId", "Product.id"],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity")), "DESC"]],
      limit: 10, // Adjust as needed
      raw: false,
    });

    return res.json({ frequentlyPurchased: items });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
