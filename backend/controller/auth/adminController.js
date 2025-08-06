import Admin from "../../model/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAdmin = async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    };

    // check the username already exists
    const admin = await Admin.findOne({ where: { username: data.username } });
    if (admin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const newAdmin = await Admin.create(data);

    // create a JWT token for the admin
    const token = jwt.sign(
      {
        username: newAdmin.dataValues.username,
        role: newAdmin.dataValues.role,
      },
      process.env.JWT_SECRET
    );

    let result = {
      jwt_token: token,
    };
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };
    const admin = await Admin.findOne({
      where: { username: data.username },
    });
    if (admin) {
      const passwordMatch = await bcrypt.compare(
        data.password,
        admin.dataValues.password
      );
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      } else {
        const token = jwt.sign(
          { username: admin.dataValues.username, role: admin.dataValues.role },
          process.env.JWT_SECRET
        );
        let result = {
          jwt_token: token,
        };
        return res.status(200).json(result);
      }
    } else {
      res.status(400).json({
        message: "Admin not found",
      });
    }
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json("Internal server error");
  }
};

// validate the admin with their jwt token and check if the admin exists
export const validateAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({
      where: { username: decoded.username },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin validated successfully",
    });
  } catch (error) {
    console.error("Error during admin validation", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete admin by username
export const deleteAdmin = async (req, res) => {
  try {
    const username = req.params.username;
    const admin = await Admin.findOne({ where: { username: username } });
    if (admin) {
      await admin.destroy();
      res.status(200).json({ message: "Admin deleted successfully" });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
