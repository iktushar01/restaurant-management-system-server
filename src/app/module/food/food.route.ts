import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
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
    checkAuth(...ALL_ROLES),
    validateRequest(listFoodQuerySchema, "query"),
    FoodController.listFoods,
);

router.get("/all", checkAuth(...ALL_ROLES), FoodController.getAllFoods);

router.get(
    "/:id",
    checkAuth(...ALL_ROLES),
    validateRequest(foodIdZodSchema, "params"),
    FoodController.getFoodById,
);

router.post(
    "/",
    checkAuth(...ALL_ROLES),
    validateRequest(createFoodZodSchema),
    FoodController.createFood,
);

router.patch(
    "/:id",
    checkAuth(...ALL_ROLES),
    validateRequest(foodIdZodSchema, "params"),
    validateRequest(updateFoodZodSchema),
    FoodController.updateFood,
);

router.delete(
    "/:id",
    checkAuth(...ALL_ROLES),
    validateRequest(foodIdZodSchema, "params"),
    FoodController.deleteFood,
);

export const FoodRoute = router;
