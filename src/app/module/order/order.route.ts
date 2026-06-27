import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { OrderController } from "./order.controller";
import {
    createOrderZodSchema,
    listOrderQuerySchema,
    orderIdZodSchema,
    updateOrderStatusZodSchema,
} from "./order.validation";

const router = Router();

router.get("/current", checkAuth(...ALL_ROLES), OrderController.getCurrentOrders);
router.get("/", checkAuth(...ALL_ROLES), validateRequest(listOrderQuerySchema, "query"), OrderController.listOrders);
router.get("/:id", checkAuth(...ALL_ROLES), validateRequest(orderIdZodSchema, "params"), OrderController.getOrderById);
router.post("/", checkAuth(...ALL_ROLES), validateRequest(createOrderZodSchema), OrderController.createOrder);
router.patch("/:id/status", checkAuth(...ALL_ROLES), validateRequest(orderIdZodSchema, "params"), validateRequest(updateOrderStatusZodSchema), OrderController.updateOrderStatus);
router.patch("/:id/cancel", checkAuth(...ALL_ROLES), validateRequest(orderIdZodSchema, "params"), OrderController.cancelOrder);

export const OrderRoute = router;
