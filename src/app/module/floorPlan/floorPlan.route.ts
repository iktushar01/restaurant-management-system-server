import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { FloorPlanController } from "./floorPlan.controller";

const router = Router();

router.get("/", checkAuth(...ALL_ROLES), FloorPlanController.getFloorPlan);
router.post("/reset", checkAuth(...ALL_ROLES), FloorPlanController.resetFloorPlan);

export const FloorPlanRoute = router;
