import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token, "jwt token is valid");
    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ error: "no token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(402).json({ error: "invalid token" });
    }
    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(403).json({ error: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    
    return res.status(404).json({ error: "intenal server error in middleware" });
  }
};
export default protectRoutes;
