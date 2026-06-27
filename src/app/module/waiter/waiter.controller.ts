import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { WaiterService } from "./waiter.service";

const listWaiters = catchAsync(async (req: Request, res: Response) => {
    const result = await WaiterService.listWaiters(req.query as any);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Waiters fetched successfully", data: result.waiters, meta: result.meta });
});

const getAllWaiters = catchAsync(async (_req: Request, res: Response) => {
    const result = await WaiterService.getAllWaiters();
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Waiters fetched successfully", data: result });
});

const getWaiterById = catchAsync(async (req: Request, res: Response) => {
    const result = await WaiterService.getWaiterById(req.params.id);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Waiter fetched successfully", data: result });
});

const createWaiter = catchAsync(async (req: Request, res: Response) => {
    const result = await WaiterService.createWaiter(req.body);
    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Waiter created successfully", data: result });
});

const updateWaiter = catchAsync(async (req: Request, res: Response) => {
    const result = await WaiterService.updateWaiter(req.params.id, req.body);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Waiter updated successfully", data: result });
});

const deleteWaiter = catchAsync(async (req: Request, res: Response) => {
    await WaiterService.deleteWaiter(req.params.id);
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Waiter deleted successfully", data: null });
});

export const WaiterController = {
    listWaiters,
    getAllWaiters,
    getWaiterById,
    createWaiter,
    updateWaiter,
    deleteWaiter,
};
