import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenandCookie from "../utils/generateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const authControllers = {
  async register(req, res) {
    try {
      const { fullName, userName, password, cpassword, gender } = req.body;
      const profilePic = req.file ? req.file.path : null;
      if (!(fullName && userName && password && cpassword && gender)) {
        return res
          .status(401)
          .json({ error: "Please provide all credentials" });
      }

      if (password !== cpassword) {
        return res
          .status(402)
          .json({ error: "Password and confirm password must match" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const avatarimage = await uploadOnCloudinary(profilePic)
      const userCheck = await userModel.findOne({ userName });
      if (userCheck) {
        return res.status(403).json({ error: "Username already exists" });
      }

      const newUser = new userModel({
        fullName,
        userName,
        password:hashPassword,
        gender,
        profilePic:avatarimage?.url,
      });

      if (newUser) {
        generateTokenandCookie(newUser._id, res);
        await newUser.save();

        return res.status(200).json({
          success: "User created successfully",
        });
      } else {
        return res.status(402).json({ error: "invaild user" });
      }
    } catch (error) {
      return res.status(405).json({ error: "Internal server error" });
    }
  },
  async login(req, res) {
    try {
      const { userName, password } = req.body;

      if (!(userName && password)) {
        return res
          .status(401)
          .json({ error: "Please provide all credentials" });
      }

      const userCheck = await userModel.findOne({ userName });
      if (!userCheck) {
        return res.status(403).json({ error: "user does not exists" });
      }
      const isMatch = await bcrypt.compare(password, userCheck.password);
      if (!isMatch) {
        res.status(404).json({ message: "Invalid Password" });
      }

      generateTokenandCookie(userCheck._id, res);

      return res.status(200).json({
        success: "User login successfully",
      });
    } catch (error) {
      
      return res.status(405).json({ error: "Internal server error" });
    }
  },
  async logout(req, res) {
    try {
      res.cookie("jwt", "", {
        maxAge: 0,
      });
      res.status(200).json({ success: "logout successfully" });
    } catch (error) {
      return res.status(406).json({ error: "internal server error" });
    }
  },
  async fetchUser(req, res) {
    try {
      const user = await userModel.findById(req.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });
      await res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
  async fetchALLUser(req, res) {
    try {
      const user = await userModel.find();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  async deleteUser(req, res){
    try {
      // const user = await userModel.findById(req.user._id);
      // if (!user) {
      //   return res.status(404).json({ message: 'User not found' });
      // }
      await userModel.deleteOne(( req.user._id));
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
     res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
export default authControllers;
