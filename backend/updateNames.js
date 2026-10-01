import mongoose from "mongoose";
import foodModel from "./Models/foodModel.js";
import categoryModel from "./Models/categoryModel.js";
import dotenv from "dotenv";

dotenv.config();

const exactFoodsMapping = [
  { public_id: "foods/jfng3ymqbxbnf2frhywi", name: "Hot Steaming Coffee", price: 80, categoryName: "Hot Drinks" },
  { public_id: "foods/brax9koogcsqgxnciisj", name: "Fresh Papaya Juice", price: 150, categoryName: "Cold Drinks" },
  { public_id: "foods/wh3b1rng1d6irzghjqsl", name: "Classic Tiramisu Cake", price: 220, categoryName: "Dessert" },
  { public_id: "foods/sc0wxbiuukvieyjdfft3", name: "Fresh Strawberry Mocktail", price: 160, categoryName: "Cold Drinks" },
  { public_id: "foods/inaigwisir3zj7hzteyq", name: "Gourmet Cheeseburger with Fries", price: 380, categoryName: "Fast Food" },
  { public_id: "foods/nh7pntwfcxcbkmbdufp2", name: "Classic Margherita Pizza", price: 420, categoryName: "Fast Food" },
  { public_id: "foods/ulclzgcrgqhaanrjisex", name: "Special Spiced Black Tea", price: 70, categoryName: "Hot Drinks" },
  { public_id: "foods/vikjtep9psphf4ze0tzz", name: "Chocolate Fudge Layer Cake", price: 240, categoryName: "Dessert" },
  { public_id: "foods/pafckfd8trcidxedmx9c", name: "Hot Lemon Ginger Tea", price: 90, categoryName: "Hot Drinks" },
  { public_id: "foods/wpu4jo3qvx4mjspbvhtm", name: "Double Smash Beef Burger", price: 390, categoryName: "Fast Food" },
  { public_id: "foods/w3gv1nkrmldvw0ge8b7x", name: "Fresh Tomato & Basil Pizza", price: 440, categoryName: "Fast Food" },
  { public_id: "foods/qxlsxzxayapokdw3zprv", name: "Assorted Fruit Smoothies", price: 180, categoryName: "Cold Drinks" },
  { public_id: "foods/ztcuy5mcdlbmkxceqdwo", name: "Strawberry Glaze Cheesecake", price: 260, categoryName: "Dessert" },
  { public_id: "foods/zli6s1ldnkgboujqbsqb", name: "Traditional Beyaynetu Platter", price: 300, categoryName: "Lunch" },
  { public_id: "foods/iccc0yatdtv7zlurr1fq", name: "Doro Wot Special with Injera", price: 480, categoryName: "Dinner" },
  { public_id: "foods/hokflwly3sr4plowbeyr", name: "Special Fetira with Butter & Honey", price: 220, categoryName: "Breakfast" },
  { public_id: "foods/o3a77alwxmugcdkumebb", name: "Sizzling Shekla Tibs", price: 450, categoryName: "Dinner" },
  { public_id: "foods/zmuyg0hendwkpryaeaut", name: "Supreme Veggie & Olive Pizza", price: 460, categoryName: "Fast Food" },
  { public_id: "foods/jfhnlvsvpj1skrqiggjk", name: "Special Chechebsa with Yogurt & Egg", price: 240, categoryName: "Breakfast" },
  { public_id: "foods/omxqquaw4pxl2ey4f3kf", name: "Traditional Gurage Kitfo", price: 520, categoryName: "Dinner" },
  { public_id: "foods/zfx0unvliq1jivbvycwf", name: "Special Dereq Beef Tibs", price: 420, categoryName: "Lunch" },
  { public_id: "foods/tgx8jambkopb4dunprlh", name: "Crispy Bacon & Cheddar Burger", price: 360, categoryName: "Fast Food" },
  { public_id: "foods/wuc3ng9n1lldozxmxmpn", name: "Layered Mixed Fruit Smoothie", price: 170, categoryName: "Cold Drinks" },
  { public_id: "foods/rjzavhsz5it0v7skcjad", name: "Chicken Noodle Soup with Herbs", price: 280, categoryName: "Lunch" },
  { public_id: "foods/awmrgtiwj0slrpvdomao", name: "Mango Mousse Cheesecake", price: 250, categoryName: "Dessert" },
  { public_id: "foods/b9leue9tpbzpxtvio9tq", name: "Italian Spaghetti Bolognese", price: 320, categoryName: "Lunch" },
  { public_id: "foods/v9htaexxmmy6fvfdw7ec", name: "Fusilli Pasta with Cherry Tomatoes", price: 290, categoryName: "Lunch" },
  { public_id: "foods/rdyn3pixob19zmo1ii8h", name: "Toasted Club Sandwich", price: 260, categoryName: "Breakfast" },
  { public_id: "foods/fwe7bm7ptxci06yxtf89", name: "Crispy Chicken & Garden Salad", price: 310, categoryName: "Lunch" }
];

async function updateExactFoodNames() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    const allCategories = await categoryModel.find({});
    const catMap = {};
    allCategories.forEach(c => {
      catMap[c.name.toLowerCase()] = c._id;
    });

    for (const item of exactFoodsMapping) {
      const catId = catMap[item.categoryName.toLowerCase()] || allCategories[0]._id;
      const updated = await foodModel.findOneAndUpdate(
        { imagePublicId: item.public_id },
        {
          name: item.name,
          price: item.price,
          category: catId
        },
        { new: true }
      );
      if (updated) {
        console.log(`Updated [${item.public_id}] => ${item.name} (${item.categoryName}) - ${item.price} ETB`);
      } else {
        console.warn(`Could not find food with public_id: ${item.public_id}`);
      }
    }

    console.log("All food items successfully updated with exact matching names and categories!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating foods:", err);
    process.exit(1);
  }
}

updateExactFoodNames();
