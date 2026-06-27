import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
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

router.get("/", checkAuth(...ALL_ROLES), validateRequest(listWaiterQuerySchema, "query"), WaiterController.listWaiters);
router.get("/all", checkAuth(...ALL_ROLES), WaiterController.getAllWaiters);
router.get("/:id", checkAuth(...ALL_ROLES), validateRequest(waiterIdZodSchema, "params"), WaiterController.getWaiterById);
router.post("/", checkAuth(...ALL_ROLES), validateRequest(createWaiterZodSchema), WaiterController.createWaiter);
router.patch("/:id", checkAuth(...ALL_ROLES), validateRequest(waiterIdZodSchema, "params"), validateRequest(updateWaiterZodSchema), WaiterController.updateWaiter);
router.delete("/:id", checkAuth(...ALL_ROLES), validateRequest(waiterIdZodSchema, "params"), WaiterController.deleteWaiter);

export const WaiterRoute = router;
