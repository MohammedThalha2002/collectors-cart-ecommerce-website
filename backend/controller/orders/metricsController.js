import express from "express";
import { QueryTypes, Op } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "../../model/order.js";
import OrderItem from "../../model/orderItem.js";
import Product from "../../model/product.js";

const router = express.Router();

/* ---------- Helper: get date ranges ---------- */
const dateRanges = () => {
  const now = new Date();
  const ytd = new Date(now.getFullYear(), 0, 1);
  const mtd = new Date(now.getFullYear(), now.getMonth(), 1);
  const wtd = new Date(now);
  wtd.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Monday
  return { ytd, mtd, wtd };
};

/* ---------- 1. Revenue & Growth ---------- */
const revenueGrowth = async () => {
  const sql = `
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month,
       SUM(total)                       AS revenue,
       LAG(SUM(total)) OVER (
           ORDER BY DATE_FORMAT(createdAt, '%Y-%m')
       ) AS prev,
       ROUND(
           100.0 * (
               SUM(total) -
               LAG(SUM(total)) OVER (
                   ORDER BY DATE_FORMAT(createdAt, '%Y-%m')
               )
           ) /
           NULLIF(
               LAG(SUM(total)) OVER (
                   ORDER BY DATE_FORMAT(createdAt, '%Y-%m')
               ), 0
           ), 2
       ) AS growth_pct
FROM Orders
GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
ORDER BY month;
  `;
  return sequelize.query(sql, { type: QueryTypes.SELECT });
};

const revenueTotal = async (start) => {
  return Order.sum("total", { where: { createdAt: { [Op.gte]: start } } });
};

const avgOrderValue = async (start) => {
  const { count, sum } = await Order.findAndCountAll({
    where: { createdAt: { [Op.gte]: start } },
    attributes: [[sequelize.fn("SUM", sequelize.col("total")), "sum"]],
    raw: true,
  });
  return parseFloat((sum / count).toFixed(2));
};

const discountLeakage = async (start) => {
  const total = await Order.sum("total", {
    where: { createdAt: { [Op.gte]: start } },
  });
  const discount = await Order.sum("discount", {
    where: { createdAt: { [Op.gte]: start } },
  });
  return {
    total,
    discount,
    leakagePct: parseFloat(((discount / total) * 100).toFixed(2)),
  };
};

/* ---------- 2. Product Performance ---------- */
const topProductsByRevenue = async (days = 30, limit = 20) => {
  const sql = `
    SELECT p.id, p.name,
           SUM(oi.price * oi.quantity) AS revenue
    FROM   OrderItems oi
           JOIN Products p ON p.id = oi.productId
           JOIN Orders   o ON o.id = oi.orderId
    WHERE  o.createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP  BY p.id
    ORDER  BY revenue DESC
    LIMIT  :limit
  `;
  return sequelize.query(sql, {
    replacements: { days, limit },
    type: QueryTypes.SELECT,
  });
};

const topProductsByProfit = async (days = 30, limit = 20) => {
  const sql = `
    SELECT p.id, p.name,
           SUM(oi.quantity * (oi.price - p.costPrice)) AS profit
    FROM   OrderItems oi
           JOIN Products p ON p.id = oi.productId
           JOIN Orders   o ON o.id = oi.orderId
    WHERE  o.createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP  BY p.id
    ORDER  BY profit DESC
    LIMIT  :limit
  `;
  return sequelize.query(sql, {
    replacements: { days, limit },
    type: QueryTypes.SELECT,
  });
};

const slowMovers = async () => {
  const sql = `
    SELECT p.id, p.name, p.inStock
    FROM   Products p
    WHERE  p.inStock > 0
      AND NOT EXISTS (
        SELECT 1 FROM OrderItems oi
        JOIN Orders o ON o.id = oi.orderId
        WHERE oi.productId = p.id AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      )
  `;
  return sequelize.query(sql, { type: QueryTypes.SELECT });
};

const categoryMix = async (days = 30) => {
  const sql = `
    SELECT c.name AS category,
           SUM(oi.price * oi.quantity) AS revenue
    FROM   OrderItems oi
           JOIN Products p ON p.id = oi.productId
           JOIN Categories c ON c.id = p.categoryId
           JOIN Orders o ON o.id = oi.orderId
    WHERE  o.createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP  BY c.id
    ORDER  BY revenue DESC
  `;
  return sequelize.query(sql, {
    replacements: { days },
    type: QueryTypes.SELECT,
  });
};

/* ---------- 3. Customer Insights ---------- */
const dailyActiveUsers = async (days = 30) => {
  const sql = `
    SELECT DATE(createdAt) AS day,
           COUNT(DISTINCT userId) AS dau
    FROM   Orders
    WHERE  createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP  BY day
    ORDER  BY day
  `;
  return sequelize.query(sql, {
    replacements: { days },
    type: QueryTypes.SELECT,
  });
};

const repeatPurchaseRate = async () => {
  const sql = `
    SELECT ROUND(100.0 * SUM(CASE WHEN cnt >= 2 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS repeat_rate
    FROM (
      SELECT userId, COUNT(*) AS cnt
      FROM Orders
      GROUP BY userId
    ) t
  `;
  const [row] = await sequelize.query(sql, { type: QueryTypes.SELECT });
  return row.repeat_rate;
};

const clv = async () => {
  const sql = `
    SELECT userId,
           SUM(total - discount) AS lifetime_value
    FROM Orders
    GROUP BY userId
  `;
  return sequelize.query(sql, { type: QueryTypes.SELECT });
};

const churnRiskUsers = async (daysInactive = 60) => {
  const sql = `
    SELECT u.id, u.email, MAX(o.createdAt) AS last_order
    FROM   Users u
           JOIN Orders o ON o.userId = u.id
    GROUP  BY u.id
    HAVING last_order < DATE_SUB(NOW(), INTERVAL :days DAY)
  `;
  return sequelize.query(sql, {
    replacements: { days: daysInactive },
    type: QueryTypes.SELECT,
  });
};

/* ---------- 4. Logistics & Fulfilment ---------- */
const deliveryFunnel = async () => {
  const sql = `
    SELECT deliveryStatus,
           COUNT(*) AS count,
           AVG(TIMESTAMPDIFF(DAY, createdAt, NOW())) AS avgDaysInState
    FROM   Orders
    GROUP  BY deliveryStatus
  `;
  return sequelize.query(sql, { type: QueryTypes.SELECT });
};

const avgDeliveryDaysPerProduct = async (days = 30) => {
  const sql = `
    SELECT p.id, p.name,
           AVG(TIMESTAMPDIFF(DAY, o.createdAt, NOW())) AS avgDays
    FROM   Orders o
           JOIN OrderItems oi ON oi.orderId = o.id
           JOIN Products p ON p.id = oi.productId
    WHERE  o.deliveryStatus = 'Delivered'
      AND  o.createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP  BY p.id
  `;
  return sequelize.query(sql, {
    replacements: { days },
    type: QueryTypes.SELECT,
  });
};

const revenueLostToCancelled = async (days = 30) => {
  return Order.sum("total", {
    where: {
      deliveryStatus: "Cancelled",
      createdAt: {
        [Op.gte]: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    },
  });
};

const geoRevenue = async (days = 30) => {
  const sql = `
    SELECT SUBSTRING_INDEX(deliveryAddress, ',', -1) AS region,
           SUM(total) AS revenue
    FROM   Orders
    WHERE  createdAt >= DATE_SUB(NOW(), INTERVAL :days DAY)
    GROUP  BY region
    ORDER  BY revenue DESC
  `;
  return sequelize.query(sql, {
    replacements: { days },
    type: QueryTypes.SELECT,
  });
};

/* ---------- Unified endpoint ---------- */
router.get("/admin", async (req, res) => {
  try {
    const { ytd, mtd, wtd } = dateRanges();

    const [
      growth,
      ytdRev,
      mtdRev,
      wtdRev,
      ytdAOV,
      mtdAOV,
      ytdDiscount,
      topRev30,
      topProfit30,
      slow,
      catMix30,
      dau30,
      repeatRate,
      clvData,
      churn,
      funnel,
      deliveryDays30,
      cancelled30,
      geo30,
    ] = await Promise.all([
      revenueGrowth(),
      revenueTotal(ytd),
      revenueTotal(mtd),
      revenueTotal(wtd),
      avgOrderValue(ytd),
      avgOrderValue(mtd),
      discountLeakage(ytd),
      topProductsByRevenue(30, 20),
      topProductsByProfit(30, 20),
      slowMovers(),
      categoryMix(30),
      dailyActiveUsers(30),
      repeatPurchaseRate(),
      clv(),
      churnRiskUsers(60),
      deliveryFunnel(),
      avgDeliveryDaysPerProduct(30),
      revenueLostToCancelled(30),
      geoRevenue(30),
    ]);

    res.json({
      revenue: {
        ytd: ytdRev,
        mtd: mtdRev,
        wtd: wtdRev,
        growth,
        aov: { ytd: ytdAOV, mtd: mtdAOV },
        discount: ytdDiscount,
      },
      products: {
        topRevenue30: topRev30,
        topProfit30,
        slowMovers: slow,
        categoryMix30: catMix30,
      },
      customers: {
        dau30,
        repeatRate,
        clv: clvData,
        churnRiskUsers: churn,
      },
      logistics: {
        deliveryFunnel: funnel,
        avgDeliveryDays30: deliveryDays30,
        cancelledRevenue30: cancelled30,
        geoRevenue30: geo30,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Metrics calculation failed" });
  }
});

export default router;
