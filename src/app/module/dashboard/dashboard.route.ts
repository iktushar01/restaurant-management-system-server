import { Router } from "express";
import { ORDER_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get("/current-orders", checkAuth(...ORDER_ROLES), DashboardController.getCurrentOrders);
router.get("/stats", checkAuth(...ORDER_ROLES), DashboardController.getDashboardStats);
router.get("/seat-layout", checkAuth(...ORDER_ROLES), DashboardController.getSeatLayout);

export const DashboardRoute = router;
