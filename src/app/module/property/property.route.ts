import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PropertyController } from "./property.controller";
import { updatePropertyZodSchema } from "./property.validation";

const router = Router();

router.get("/", checkAuth(...ALL_ROLES), PropertyController.getProperty);

router.patch(
    "/",
    checkAuth(...ALL_ROLES),
    validateRequest(updatePropertyZodSchema),
    PropertyController.updateProperty,
);

export const PropertyRoute = router;
