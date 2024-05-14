import jwt from "jsonwebtoken";

const generateTokenandCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax", 
    secure: isProduction, 
  });
};
export default generateTokenandCookie;
