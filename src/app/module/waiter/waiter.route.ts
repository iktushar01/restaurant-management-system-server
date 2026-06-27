import { Router } from "express";
import { REFERENCE_READ_ROLES, SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { WaiterController } from "./waiter.controller";
import {
    createWaiterZodSchema,
    listWaiterQuerySchema,
    updateWaiterZodSchema,
    waiterIdZodSchema,
} from "./waiter.validation";

const router = Router();

router.get("/", checkAuth(...REFERENCE_READ_ROLES), validateRequest(listWaiterQuerySchema, "query"), WaiterController.listWaiters);
router.get("/all", checkAuth(...REFERENCE_READ_ROLES), WaiterController.getAllWaiters);
router.get("/:id", checkAuth(...REFERENCE_READ_ROLES), validateRequest(waiterIdZodSchema, "params"), WaiterController.getWaiterById);
router.post("/", checkAuth(...SETTINGS_ROLES), validateRequest(createWaiterZodSchema), WaiterController.createWaiter);
router.patch("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(waiterIdZodSchema, "params"), validateRequest(updateWaiterZodSchema), WaiterController.updateWaiter);
router.delete("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(waiterIdZodSchema, "params"), WaiterController.deleteWaiter);

export const WaiterRoute = router;
