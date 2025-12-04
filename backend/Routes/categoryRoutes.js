import express from "express";
import multer from "multer";
import { addCategory, listCategory, removeCategory, updateCategory } from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

// Routes
categoryRouter.post("/add", upload.single("image"), addCategory); // add category with image
categoryRouter.get("/list", listCategory);                        // list all categories
categoryRouter.post("/remove", removeCategory);                   // remove category
categoryRouter.post("/update", upload.single("image"), updateCategory); // update category with optional new image

export default categoryRouter;
