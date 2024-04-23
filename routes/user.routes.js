import express from 'express'
import protectRoutes from '../middleware/protectRoutes.js';
import getAllUser from '../controllers/user.controller.js';
const routes =express.Router();
routes.get('/',protectRoutes,getAllUser.loggedInUser)

export default routes;
