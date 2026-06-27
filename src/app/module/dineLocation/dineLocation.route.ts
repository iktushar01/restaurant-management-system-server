import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
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

router.get("/", checkAuth(...ALL_ROLES), validateRequest(listDineLocationQuerySchema, "query"), DineLocationController.listDineLocations);
router.get("/all", checkAuth(...ALL_ROLES), DineLocationController.getAllDineLocations);
router.get("/:id", checkAuth(...ALL_ROLES), validateRequest(dineLocationIdZodSchema, "params"), DineLocationController.getDineLocationById);
router.post("/", checkAuth(...ALL_ROLES), validateRequest(createDineLocationZodSchema), DineLocationController.createDineLocation);
router.patch("/:id", checkAuth(...ALL_ROLES), validateRequest(dineLocationIdZodSchema, "params"), validateRequest(updateDineLocationZodSchema), DineLocationController.updateDineLocation);
router.delete("/:id", checkAuth(...ALL_ROLES), validateRequest(dineLocationIdZodSchema, "params"), DineLocationController.deleteDineLocation);

export const DineLocationRoute = router;
