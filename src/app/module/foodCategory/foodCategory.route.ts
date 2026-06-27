import { Router } from "express";
import { SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { FoodCategoryController } from "./foodCategory.controller";
import {
    createFoodCategoryZodSchema,
    foodCategoryIdZodSchema,
    listFoodCategoryQuerySchema,
    updateFoodCategoryZodSchema,
} from "./foodCategory.validation";

const router = Router();

router.get(
    "/",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(listFoodCategoryQuerySchema, "query"),
    FoodCategoryController.listFoodCategories,
);

router.get(
    "/all",
    checkAuth(...SETTINGS_ROLES),
    FoodCategoryController.getAllFoodCategories,
);

router.get(
    "/:id",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(foodCategoryIdZodSchema, "params"),
    FoodCategoryController.getFoodCategoryById,
);

router.post(
    "/",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(createFoodCategoryZodSchema),
    FoodCategoryController.createFoodCategory,
);

router.patch(
    "/:id",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(foodCategoryIdZodSchema, "params"),
    validateRequest(updateFoodCategoryZodSchema),
    FoodCategoryController.updateFoodCategory,
);

router.delete(
    "/:id",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(foodCategoryIdZodSchema, "params"),
    FoodCategoryController.deleteFoodCategory,
);

export const FoodCategoryRoute = router;
