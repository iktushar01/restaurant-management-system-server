import { Router } from "express";
import { ORDER_ROLES } from "../../constants/roles";
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

router.get("/current", checkAuth(...ORDER_ROLES), OrderController.getCurrentOrders);
router.get("/", checkAuth(...ORDER_ROLES), validateRequest(listOrderQuerySchema, "query"), OrderController.listOrders);
router.get("/:id", checkAuth(...ORDER_ROLES), validateRequest(orderIdZodSchema, "params"), OrderController.getOrderById);
router.post("/", checkAuth(...ORDER_ROLES), validateRequest(createOrderZodSchema), OrderController.createOrder);
router.patch("/:id/status", checkAuth(...ORDER_ROLES), validateRequest(orderIdZodSchema, "params"), validateRequest(updateOrderStatusZodSchema), OrderController.updateOrderStatus);
router.patch("/:id/cancel", checkAuth(...ORDER_ROLES), validateRequest(orderIdZodSchema, "params"), OrderController.cancelOrder);

export const OrderRoute = router;
