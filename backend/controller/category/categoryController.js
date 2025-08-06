import Category from "../../model/category.js";
import SubCategory from "../../model/subCategory.js";
import Product from "../../model/product.js";

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
    res.status(200).json(categories);
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

    res.status(200).json(subCategories);
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
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json("Failed to fetch subcategories");
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
