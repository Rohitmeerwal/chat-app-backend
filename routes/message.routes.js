import express  from "express";
import protectRoutes from "../middleware/protectRoutes.js";
import messageController from "../controllers/message.controller.js";

const routes = express.Router();
routes.post('/send/:id', protectRoutes, messageController.sendMessage)
routes.get('/:id', protectRoutes, messageController.getMessage)
export default routes