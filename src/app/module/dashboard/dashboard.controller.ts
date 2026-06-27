import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DashboardService } from "./dashboard.service";
import { OrderService } from "../order/order.service";

const getCurrentOrders = catchAsync(async (_req: Request, res: Response) => {
    const result = await OrderService.getCurrentOrders();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Current orders fetched successfully",
        data: result,
    });
});

const getSeatLayout = catchAsync(async (_req: Request, res: Response) => {
    const result = await DashboardService.getSeatLayout();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Seat layout fetched successfully",
        data: result,
    });
});

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
    const result = await DashboardService.getDashboardStats();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: result,
    });
});

export const DashboardController = {
    getCurrentOrders,
    getSeatLayout,
    getDashboardStats,
};
