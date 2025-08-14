import Category from "../../model/category.js";
import SubCategory from "../../model/subCategory.js";
import Product from "../../model/product.js";
import sequelize from "../../config/db.js";

export const addCategory = async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json("Category name is required");
  }

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({
      where: { name: name },
    });

    if (existingCategory) {
      return res.status(400).json("Category already exists");
    }

    // Create the new category
    const newCategory = await Category.create({ name: name });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json("Failed to add category");
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    // Add product counts to each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.count({
          where: { categoryId: category.id },
        });
        return {
          ...category.toJSON(),
          productCount,
        };
      })
    );

    res.status(200).json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json("Failed to fetch categories");
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findOne({
      where: { id: id },
    });

    if (!category) {
      return res.status(404).json("Category not found");
    }

    // Check if the category has associated subcategories
    const subCategories = await SubCategory.findAll({
      where: { categoryId: id },
    });

    if (subCategories.length > 0) {
      return res
        .status(400)
        .json("Cannot delete category with associated subcategories");
    }

    // Delete the category
    await Category.destroy({
      where: { id: id },
    });

    res.status(200).json("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json("Failed to delete category");
  }
};

export const addSubCategory = async (req, res) => {
  const { name, image, categoryId } = req.body;
  console.log(req.body);

  // Validate input
  if (!name || !image || !categoryId) {
    return res.status(400).json("Name, image, and categoryId are required");
  }

  try {
    // Check if the category exists
    const category = await Category.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json("Category not found");
    }

    // Check if the subcategory already exists under the same category
    const existingSubCategory = await SubCategory.findOne({
      where: {
        name: name,
        categoryId: categoryId,
      },
    });

    if (existingSubCategory) {
      return res.status(400).json({
        message: "Subcategory already exists under this category",
      });
    }

    // Create the new subcategory
    const newSubCategory = await SubCategory.create({
      name: name,
      image: image,
      categoryId: categoryId,
    });

    res.status(201).json(newSubCategory);
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      message: "Failed to add subcategory",
    });
  }
};

export const getSubCategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Fetch subcategories under the specified category
    const subCategories = await SubCategory.findAll({
      where: { categoryId: categoryId },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    // Add product counts to each subcategory
    const subCategoriesWithCounts = await Promise.all(
      subCategories.map(async (subCategory) => {
        const productCount = await Product.count({
          where: { subCategoryId: subCategory.id },
        });
        return {
          ...subCategory.toJSON(),
          productCount,
        };
      })
    );

    res.status(200).json(subCategoriesWithCounts);
  } catch (error) {
    console.error("Error fetching subcategories by category:", error);
    res.status(500).json({
      message: "Failed to fetch subcategories",
    });
  }
};

export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    // Add product counts to each subcategory
    const subCategoriesWithCounts = await Promise.all(
      subCategories.map(async (subCategory) => {
        const productCount = await Product.count({
          where: { subCategoryId: subCategory.id },
        });
        return {
          ...subCategory.toJSON(),
          productCount,
        };
      })
    );

    res.status(200).json(subCategoriesWithCounts);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json("Failed to fetch subcategories");
  }
};

export const getCategoriesWithSubcategoriesAndCounts = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.findAll({
      include: [
        {
          model: SubCategory,
          required: false, // LEFT JOIN to include categories without subcategories
        },
      ],
    });

    // Add product counts to each category and subcategory
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Count total products in this category
        const totalProductCount = await Product.count({
          where: { categoryId: category.id },
        });

        // Add product counts to subcategories
        const subCategoriesWithCounts = await Promise.all(
          category.SubCategories.map(async (subCategory) => {
            const productCount = await Product.count({
              where: { subCategoryId: subCategory.id },
            });
            return {
              ...subCategory.toJSON(),
              productCount,
            };
          })
        );

        return {
          ...category.toJSON(),
          totalProductCount,
          SubCategories: subCategoriesWithCounts,
        };
      })
    );

    res.status(200).json(categoriesWithCounts);
  } catch (error) {
    console.error(
      "Error fetching categories with subcategories and counts:",
      error
    );
    res.status(500).json({
      message: "Failed to fetch categories with subcategories and counts",
    });
  }
};

export const getCategoryWithProductCount = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Get the category
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Count products in this category
    const productCount = await Product.count({
      where: { categoryId: categoryId },
    });

    res.status(200).json({
      ...category.toJSON(),
      productCount,
    });
  } catch (error) {
    console.error("Error fetching category with product count:", error);
    res.status(500).json({
      message: "Failed to fetch category with product count",
    });
  }
};

export const getSubCategoryWithProductCount = async (req, res) => {
  const { subCategoryId } = req.params;

  try {
    // Get the subcategory with its category
    const subCategory = await SubCategory.findOne({
      where: { id: subCategoryId },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!subCategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    // Count products in this subcategory
    const productCount = await Product.count({
      where: { subCategoryId: subCategoryId },
    });

    res.status(200).json({
      ...subCategory.toJSON(),
      productCount,
    });
  } catch (error) {
    console.error("Error fetching subcategory with product count:", error);
    res.status(500).json({
      message: "Failed to fetch subcategory with product count",
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the subcategory exists
    const subCategory = await SubCategory.findOne({
      where: { id: id },
    });

    if (!subCategory) {
      return res.status(404).json("Subcategory not found");
    }

    // Check if any products are mapped to this subcategory
    const products = await Product.findAll({
      where: { subCategoryId: id },
    });

    if (products.length > 0) {
      return res.status(400).json({
        message: "Cannot delete subcategory: Products are mapped to it",
      });
    }

    // If no products are mapped, delete the subcategory
    await SubCategory.destroy({
      where: { id: id },
    });

    res.status(200).json({
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json("Failed to delete subcategory");
  }
};
