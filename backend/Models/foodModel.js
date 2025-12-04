import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    price :{
        type:Number,
        required:true
    },
   category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
    image:{
        type:String,
        required:true
    },
    imagePublicId: {
      type: String, // for deleting from Cloudinary later
    },
  },
  { timestamps: true }
);

const foodModel = mongoose.models.food || mongoose.model("Food", foodSchema);
export default foodModel;