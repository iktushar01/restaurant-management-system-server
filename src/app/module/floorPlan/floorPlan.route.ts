import { Router } from "express";
import { SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { FloorPlanController } from "./floorPlan.controller";

const router = Router();

router.get("/", checkAuth(...SETTINGS_ROLES), FloorPlanController.getFloorPlan);
router.post("/reset", checkAuth(...SETTINGS_ROLES), FloorPlanController.resetFloorPlan);

export const FloorPlanRoute = router;
