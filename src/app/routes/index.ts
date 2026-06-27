import express from "express";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { FoodCategoryRoute } from "../module/foodCategory/foodCategory.route";
import { FoodRoute } from "../module/food/food.route";
import { PropertyRoute } from "../module/property/property.route";

const router = express.Router();

router.use("/auth", AuthRoute);
router.use("/users", UserRoutes);
router.use("/food-categories", FoodCategoryRoute);
router.use("/foods", FoodRoute);
router.use("/property", PropertyRoute);


export const IndexRoute = router;
