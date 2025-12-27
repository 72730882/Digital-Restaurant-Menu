import multer from "multer";

// Use memory storage for Vercel/Cloudinary compatibility
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;