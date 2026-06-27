import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get("/current-orders", checkAuth(...ALL_ROLES), DashboardController.getCurrentOrders);
router.get("/stats", checkAuth(...ALL_ROLES), DashboardController.getDashboardStats);
router.get("/seat-layout", checkAuth(...ALL_ROLES), DashboardController.getSeatLayout);

export const DashboardRoute = router;
