import express from "express";
import { addCategory, listCategory, removeCategory, updateCategory } from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

// Routes
categoryRouter.post("/add", addCategory);      // add category
categoryRouter.get("/list", listCategory);    // list all categories
categoryRouter.post("/remove", removeCategory); // remove category
categoryRouter.post("/update", updateCategory); // update category with optional new image

export default categoryRouter;
