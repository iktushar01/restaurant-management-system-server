import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { FloorPlanService } from "./floorPlan.service";

const getFloorPlan = catchAsync(async (_req: Request, res: Response) => {
    const result = await FloorPlanService.getFloorPlan();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Floor plan fetched successfully",
        data: result,
    });
});

const resetFloorPlan = catchAsync(async (_req: Request, res: Response) => {
    const result = await FloorPlanService.resetFloorPlan();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Floor plan layout reset successfully",
        data: result,
    });
});

export const FloorPlanController = {
    getFloorPlan,
    resetFloorPlan,
};
