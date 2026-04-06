import Category from "../../model/category.js";
import Product from "../../model/product.js";
import { Op, ValidationError } from "sequelize";
import SubCategory from "../../model/subCategory.js";
import Queue from "bull";
import User from "../../model/user.js";
import { sendStockUpdateMail } from "../mailer/mailController.js";

const notifyStockQueue = new Queue("notifyStockQueue", {
  redis: { host: "localhost", port: 6379 },
});

export const addProduct = async (req, res) => {
  const data = req.body;

  let info = {
    name: data.name,
    productId: data.productId,
    description: data.description,
    images: data.images,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    continent: data.continent,
    country: data.country,
    tags: data.tags,
    inStock: data.inStock,
    bestSeller: data.bestSeller,
    isDealOfTheDay: data.isDealOfTheDay,
    categoryId: data.categoryId,
    subCategoryId: data.subCategoryId,
    shippingPeriod: data.shippingPeriod,
    gst: data.gst,
  };
  try {
    // Create the product using the Product model
    await Product.create(info);
    res.status(201).json({
      message: "Product added successfully",
    }); // Send the created product as the response
  } catch (error) {
    let message = "Something went wrong";

    if (error instanceof ValidationError) {
      error.errors.forEach((error) => {
        if (error.validatorKey === "not_unique") {
          message =
            "Please enter a unique productId. This productId is already taken.";
        }
      });
    }

    res.status(400).json({
      message: "Failed to add the product. " + message,
    });
  }
};

export const addProducts = async (req, res) => {
  const data = req.body ? req.body : [];

  data.forEach(async (product) => {
    let info = {
      name: product.name,
      productId: product.productId,
      description: product.description,
      images: product.images,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      continent: product.continent,
      country: product.country,
      tags: product.tags,
      inStock: product.inStock,
      bestSeller: product.bestSeller,
      isDealOfTheDay: product.isDealOfTheDay,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      shippingPeriod: product.shippingPeriod,
      gst: product.gst,
    };
    try {
      await Product.create(info);
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(400).json({
        message: "Failed to add the product",
      });
    }
  });
  try {
    // Create the product using the Product model
    res.status(201).json({
      message: "Products added successfully",
    }); // Send the created product as the response
  } catch (error) {
    console.error("Error adding product:", error);
    let message = "Something went wrong";

    if (error instanceof ValidationError) {
      error.errors.forEach((error) => {
        if (error.validatorKey === "not_unique") {
          message =
            "Please enter a unique productId. This productId is already taken.";
        }
      });
    }

    res.status(400).json({
      message: "Failed to add the product. " + message,
    });
  }
};

export const updateProductById = async (req, res) => {
  // check if the product exists
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const data = req.body;

  let info = {
    productUrl: `${process.env.CLIENT_URL}/collections/${product.id}`,
    productId: data.productId,
    name: data.name,
    description: data.description,
    images: data.images,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    continent: data.continent,
    country: data.country,
    tags: data.tags,
    inStock: data.inStock,
    bestSeller: data.bestSeller || false,
    isDealOfTheDay: data.isDealOfTheDay || false,
    categoryId: data.categoryId,
    subCategoryId: data.subCategoryId || null,
    shippingPeriod: data.shippingPeriod || 7,
    gst: data.gst || 5,
  };

  try {
    await Product.update(info, {
      where: { id: req.params.id },
    });

    if (info.inStock > product.inStock) {
      // If the stock is increased, notify users who are interested in this product
      const notifyUserIds = product.notifyUserIds || [];
      if (notifyUserIds.length > 0) {
        await notifyStockQueue.add({
          product: info,
          userIds: notifyUserIds,
        });
      }
    }

    res.send({
      message: "Products updated successfully",
    });
  } catch (error) {
    console.log(error);
    let message = "Something went wrong";

    if (error instanceof ValidationError) {
      error.errors.forEach((error) => {
        if (error.validatorKey === "not_unique") {
          message =
            "Please enter a unique productId. This productId is already taken.";
        }
      });
    }

    res.status(400).json({
      message: "Failed to update the product. " + message,
    });
  }
};

export const getProducts = async (req, res) => {
  const match = {};
  const sort = [];
  const isAdmin = req.user_role != "user" ? true : false;

  // Filtering
  if (req.query.bestSeller) {
    match.bestSeller = req.query.bestSeller === "true";
  }

  if (req.query.isDealOfTheDay) {
    match.isDealOfTheDay = req.query.isDealOfTheDay === "true";
  }

  if (req.query.country) {
    match.country = req.query.country;
  }

  if (req.query.continent) {
    match.continent = req.query.continent;
  }

  // caterogy id can be multiple or single
  if (req.query.categoryId) {
    match.categoryId = req.query.categoryId;
  }
  if (req.query.categoryIds) {
    const categororyIds = req.query.categoryIds.split(",");
    match.categoryId = {
      [Op.in]: categororyIds,
    };
  }

  if (req.query.subCategoryId) {
    match.subCategoryId = req.query.subCategoryId;
  }
  if (req.query.subCategoryIds) {
    const subCategoryIds = req.query.subCategoryIds.split(",");
    match.subCategoryId = {
      [Op.in]: subCategoryIds,
    };
  }

  // Searching
  if (req.query.search) {
    const search = req.query.search
      .toLowerCase()
      .trim()
      .replace(/[%_]/g, "\\$&");

    match[Op.or] = [
      isAdmin ? { productId: { [Op.like]: `%${search}%` } } : null,
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { continent: { [Op.like]: `%${search}%` } },
      { country: { [Op.like]: `%${search}%` } },
      { "$Category.name$": { [Op.like]: `%${search}%` } },
      { "$SubCategory.name$": { [Op.like]: `%${search}%` } },
    ];
  }

  //  --------------------- Sorting --------------------------

  // By Date
  if (req.query.sortByDate) {
    const sortOrder = req.query.sortByDate;
    sort.push(["createdAt", sortOrder]);
  }

  // By price
  if (req.query.sortByPrice) {
    const sortOrder = req.query.sortByPrice;
    sort.push(["sellingPrice", sortOrder]);
  }

  // Price range filtering
  if (req.query.minPrice && req.query.maxPrice) {
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      match.sellingPrice = {
        [Op.between]: [minPrice, maxPrice],
      };
    }
  }

  // By Low Stock for inventory management
  if (req.query.stock) {
    const lowStockThreshold = parseInt(req.query.stock) || 0;
    match.inStock = {
      [Op.lte]: lowStockThreshold,
    };
    sort.push(["inStock", "ASC"]);
  }

  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch products with filters, pagination, and sorting
    const products = await Product.findAll({
      where: match,
      offset: offset,
      order: sort.length ? sort : [["createdAt", "DESC"]],
      limit: limit,

      // include the name of the associated category and subcategory
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: SubCategory,
          attributes: ["id", "name"],
        },
      ],

      attributes: isAdmin
        ? {
            exclude: ["notifyUserIds"],
          }
        : {
            exclude: ["notifyUserIds", "costPrice"],
          },
    });

    // Calculate metadata for pagination
    const total = await Product.count({
      where: match,
      include: [
        {
          model: Category,
          attributes: [],
        },
        {
          model: SubCategory,
          attributes: [],
        },
      ],
    });
    const meta = {
      total: total,
      limit: limit,
      offset: offset,
      page: offset / limit + 1,
    };

    // Prepare the response
    const output = {
      data: products,
      meta: meta,
    };
    res.send(output);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).json({
      message: "Failed to fetch the products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: SubCategory,
          attributes: ["id", "name"],
        },
      ],
    });

    if (product) {
      res.send(product);
    } else {
      res.status(404).json("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(400).json("Failed to fetch the product");
  }
};

// Delete a product by ID
export const deleteProductById = async (req, res) => {
  try {
    const result = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 1) {
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(400).json({
      message: "Failed to delete the product",
    });
  }
};

// Delete multiple product by ID
export const deleteMultipleProductsById = async (req, res) => {
  const productIds = req.query.ids;
  console.log(productIds);

  if (productIds) {
    try {
      const products = await Product.findAll({
        where: {
          id: productIds,
        },
      });

      if (products.length !== productIds.length) {
        console.log("Products not found " + productIds + typeof productIds);
        return res.status(404).json({
          message: "Products not found",
        });
      }

      const result = await Product.destroy({
        where: {
          id: productIds,
        },
      });

      if (result === 1) {
        res.status(200).json({
          message: "Product deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(400).json({
        message: "Failed to delete the product",
      });
    }
  } else {
    res.status(400).json({
      message: "Product Ids are required",
    });
  }
};

export const search = async (req, res) => {
  const match = req.query.s;

  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${match}%` } },
          { description: { [Op.like]: `%${match}%` } },
          { continent: { [Op.like]: `%${match}%` } },
          { country: { [Op.like]: `%${match}%` } },
          { "$Category.name$": { [Op.like]: `%${match}%` } },
          { "$SubCategory.name$": { [Op.like]: `%${match}%` } },
        ],
      },
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: SubCategory,
          attributes: ["name"],
        },
      ],
      limit: 10,
    });

    res.send(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(400).json("Failed to search products");
  }
};

export const notifyStockUsers = async (req, res) => {
  const productId = req.params.id;

  // check if the product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const notifyUserIds = product.notifyUserIds || [];
  const userId = req.user.id;
  if (!notifyUserIds.includes(userId)) {
    notifyUserIds.push(userId);
  }
  console.log("Notify User IDs:", notifyUserIds);

  try {
    await Product.update(
      { notifyUserIds: notifyUserIds },
      { where: { id: productId } }
    );

    res.status(200).json({
      message: "You will be notified when the product is back in stock",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({
      message: "Failed to update the product",
    });
  }
};

const notifyStock = async (job) => {
  const { product, userIds } = job.data;

  const emailList = [];
  for (const userId of userIds) {
    // get the user email from userId
    const user = await User.findByPk(userId);
    if (user) {
      emailList.push(user.email);
    }
  }
  await sendStockUpdateMail(emailList, product);

  // remove the notifyUserIds from the product
  await Product.update(
    { notifyUserIds: null },
    { where: { id: product.productId } }
  );
};

notifyStockQueue.process(notifyStock);
