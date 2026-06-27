import { Router } from "express";
import { SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { FoodController } from "./food.controller";
import {
    createFoodZodSchema,
    foodIdZodSchema,
    listFoodQuerySchema,
    updateFoodZodSchema,
} from "./food.validation";

const router = Router();

router.get(
    "/",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(listFoodQuerySchema, "query"),
    FoodController.listFoods,
);

router.get("/all", checkAuth(...SETTINGS_ROLES), FoodController.getAllFoods);

router.get(
    "/:id",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(foodIdZodSchema, "params"),
    FoodController.getFoodById,
);

router.post(
    "/",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(createFoodZodSchema),
    FoodController.createFood,
);

router.patch(
    "/:id",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(foodIdZodSchema, "params"),
    validateRequest(updateFoodZodSchema),
    FoodController.updateFood,
);

router.delete(
    "/:id",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(foodIdZodSchema, "params"),
    FoodController.deleteFood,
);

export const FoodRoute = router;
