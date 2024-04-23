import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenandCookie from "../utils/generateToken.js";
const authControllers = {
  async register(req, res) {
    try {
      const { fullName, userName, password, cpassword, gender } = req.body;
      const profilePic = req.file ? req.file.path : null;
      console.log(profilePic, "profile");
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

      const userCheck = await userModel.findOne({ userName });
      if (userCheck) {
        return res.status(403).json({ error: "Username already exists" });
      }

      const newUser = new userModel({
        fullName,
        userName,
        password: hashPassword,
        gender,
        profilePic,
      });

      if (newUser) {
        generateTokenandCookie(newUser._id, res);
        await newUser.save();

        return res.status(200).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          userName: newUser.userName,
          profilePic: newUser.profilePic,
          success: "User created successfully",
        });
      } else {
        return res.status(402).json({ error: "invaild user" });
      }
    } catch (error) {
      console.error(error);
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
        _id: userCheck._id,
        fullName: userCheck.fullName,
        userName: userCheck.userName,
        profilePic: userCheck.profilePic,
        success: "User login successfully",
      });
    } catch (error) {
      console.error(error);
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
      const user = await userModel
        .findByIdAndUpdate(
          req.user._id,
          {},
          { select: "userName profilePic gender fullName" },
        )
        .exec();
      if (!user) return res.status(404).json({ error: "User not found" });
      await res.json({ user });
    } catch (error) {
      console.log(error, "fetchError");
      res.status(500).json({ error: "something went wrong" });
    }
  },
};
export default authControllers;
