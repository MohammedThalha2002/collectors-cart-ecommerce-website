import User from "../../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Signs in (or registers) a user.
 * If no user exists with the provided email, a new user is created.
 * Expected data: { name, email, password, phone, address, city, pincode, state }
 */
export const userSignIn = async (req, res) => {
  const data = req.body;
  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({
      where: { email: data.email },
    });

    if (!existingUser) {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create a new user with the new schema fields
      const newUser = await User.create({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      });

      // Exclude sensitive fields from the response
      const { password, ...userData } = newUser.dataValues;

      if (req.user_role == "admin") {
        return res.send({
          id: userData.id,
          email: userData.email,
        });
      }

      // Generate JWT token
      const jwt_token = jwt.sign(
        { data: userData.email, id: userData.id },
        process.env.JWT_SECRET
      );

      res.send({ jwt: jwt_token });
    } else {
      res.status(400).json({
        errors: { message: "User already exists with this email" },
      });
    }
  } catch (error) {
    console.error("Failed to create user", error);
    res.status(400).json({ errors: { message: "Failed to create user" } });
  }
};

/**
 * Logs in a user.
 * Expected data: { email, password }
 */
export const userLogIn = async (req, res) => {
  const data = req.body;
  try {
    // Find user by email
    const user = await User.findOne({
      where: { email: data.email },
    });

    if (user) {
      // Compare given password with hashed password stored
      const passwordMatch = await bcrypt.compare(
        data.password,
        user.dataValues.password
      );
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ errors: { message: "Invalid password" } });
      } else {
        // Exclude sensitive fields
        const { password, ...userData } = user.dataValues;
        // Generate JWT token
        const jwt_token = jwt.sign(
          { data: userData.email, id: userData.id },
          process.env.JWT_SECRET
        );
        res.send({ jwt: jwt_token });
      }
    } else {
      res.status(400).json({ errors: { message: "User not found" } });
    }
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json("Internal server error");
  }
};

/**
 * Retrieves a single user by id.
 * Expects the user id to be provided.
 */
export const findOneUser = async (req, res, id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    res.status(500).json("User not found");
  }
};

/**
 * Retrieves a single user by email.
 * Expects the user email to be provided.
 */
export const findUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    res.status(500).json("User not found");
  }
};

/**
 * Checks if a user exists by email.
 * Expects the user email to be provided.
 */
export const checkUserExistsByEmail = async (req, res) => {
  try {
    if (!req.query.email) {
      return res
        .status(400)
        .json({ message: "Email query parameter required" });
    }

    const user = await User.findOne({
      where: { email: req.query.email },
    });
    if (user) {
      res.send({ userId: user.id, exists: true });
    } else {
      res.send({ userId: null, exists: false });
    }
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    res.status(500).json("User not found");
  }
};

/**
 * Updates user information.
 * Expected data: { name, phone }
 *
 **/
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    await user.update({ name, phone });

    // Exclude sensitive fields from the response
    const { password, ...updatedUser } = user.dataValues;

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};
