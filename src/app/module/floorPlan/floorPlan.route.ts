import { Router } from "express";
import { REFERENCE_READ_ROLES, SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { FloorPlanController } from "./floorPlan.controller";

const router = Router();

router.get("/", checkAuth(...REFERENCE_READ_ROLES), FloorPlanController.getFloorPlan);
router.post("/reset", checkAuth(...SETTINGS_ROLES), FloorPlanController.resetFloorPlan);

export const FloorPlanRoute = router;
