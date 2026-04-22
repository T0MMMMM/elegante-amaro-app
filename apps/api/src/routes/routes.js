import express from "express";
import * as usersCtrl from "../controllers/users.controller.js";

const routes = express.Router();

// Users
routes.get('/users', usersCtrl.getUsers);
    
export default routes;