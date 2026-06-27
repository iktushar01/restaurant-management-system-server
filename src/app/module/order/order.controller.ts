import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrderService } from "./order.service";

const listOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.listOrders(req.query as any);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Orders fetched successfully", data: result.orders, meta: result.meta });
});

const getCurrentOrders = catchAsync(async (_req: Request, res: Response) => {
    const result = await OrderService.getCurrentOrders();
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Current orders fetched successfully", data: result });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getOrderById(req.params.id);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Order fetched successfully", data: result });
});

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.createOrder(req.body);
    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Order placed successfully", data: result });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.updateOrderStatus(req.params.id, req.body.status);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Order status updated successfully", data: result });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.cancelOrder(req.params.id);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Order cancelled successfully", data: result });
});

export const OrderController = {
    listOrders,
    getCurrentOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
};
