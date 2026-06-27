import { Router } from "express";
import { SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PropertyController } from "./property.controller";
import { updatePropertyZodSchema } from "./property.validation";

const router = Router();

router.get("/", checkAuth(...SETTINGS_ROLES), PropertyController.getProperty);

router.patch(
    "/",
    checkAuth(...SETTINGS_ROLES),
    validateRequest(updatePropertyZodSchema),
    PropertyController.updateProperty,
);

export const PropertyRoute = router;
