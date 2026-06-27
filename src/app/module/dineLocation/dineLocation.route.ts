import { Router } from "express";
import { SETTINGS_ROLES } from "../../constants/roles";
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

router.get("/", checkAuth(...SETTINGS_ROLES), validateRequest(listDineLocationQuerySchema, "query"), DineLocationController.listDineLocations);
router.get("/all", checkAuth(...SETTINGS_ROLES), DineLocationController.getAllDineLocations);
router.get("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineLocationIdZodSchema, "params"), DineLocationController.getDineLocationById);
router.post("/", checkAuth(...SETTINGS_ROLES), validateRequest(createDineLocationZodSchema), DineLocationController.createDineLocation);
router.patch("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineLocationIdZodSchema, "params"), validateRequest(updateDineLocationZodSchema), DineLocationController.updateDineLocation);
router.delete("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineLocationIdZodSchema, "params"), DineLocationController.deleteDineLocation);

export const DineLocationRoute = router;
