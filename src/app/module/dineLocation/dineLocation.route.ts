import { Router } from "express";
import { REFERENCE_READ_ROLES, SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { DineLocationController } from "./dineLocation.controller";
import {
    createDineLocationZodSchema,
    dineLocationIdZodSchema,
    listDineLocationQuerySchema,
    updateDineLocationZodSchema,
} from "./dineLocation.validation";

const router = Router();

router.get("/", checkAuth(...REFERENCE_READ_ROLES), validateRequest(listDineLocationQuerySchema, "query"), DineLocationController.listDineLocations);
router.get("/all", checkAuth(...REFERENCE_READ_ROLES), DineLocationController.getAllDineLocations);
router.get("/:id", checkAuth(...REFERENCE_READ_ROLES), validateRequest(dineLocationIdZodSchema, "params"), DineLocationController.getDineLocationById);
router.post("/", checkAuth(...SETTINGS_ROLES), validateRequest(createDineLocationZodSchema), DineLocationController.createDineLocation);
router.patch("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineLocationIdZodSchema, "params"), validateRequest(updateDineLocationZodSchema), DineLocationController.updateDineLocation);
router.delete("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineLocationIdZodSchema, "params"), DineLocationController.deleteDineLocation);

export const DineLocationRoute = router;
