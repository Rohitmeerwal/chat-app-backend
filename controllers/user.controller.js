import userModel from "../models/userModel.js";

const getAllUser = {
  async loggedInUser(req, res) {
    try {
      const loggedInUser = req.user._id;
      const filterUser = await userModel
        .find({ _id: { $ne: loggedInUser } })
        .select("-password");
      return res.status(200).json(filterUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
export default getAllUser;
