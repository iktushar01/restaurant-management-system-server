import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { WorkPeriodService } from "./workPeriod.service";

const listWorkPeriods = catchAsync(async (req: Request, res: Response) => {
    const result = await WorkPeriodService.listWorkPeriods(req.query as any);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Work periods fetched successfully",
        data: result.periods,
        meta: result.meta,
    });
});

const getActiveWorkPeriod = catchAsync(async (_req: Request, res: Response) => {
    const period = await WorkPeriodService.getActiveWorkPeriod();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: period ? "Active work period fetched" : "No active work period",
        data: period,
    });
});

const getWorkPeriodById = catchAsync(async (req: Request, res: Response) => {
    const result = await WorkPeriodService.getWorkPeriodById(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Work period fetched successfully",
        data: result,
    });
});

const openWorkPeriod = catchAsync(async (req: Request, res: Response) => {
    const result = await WorkPeriodService.openWorkPeriod(req.body.openingCash ?? 0);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Work period opened successfully",
        data: result,
    });
});

const closeWorkPeriod = catchAsync(async (req: Request, res: Response) => {
    const result = await WorkPeriodService.closeWorkPeriod(req.params.id, req.body.closingCash);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Work period closed successfully",
        data: result,
    });
});

export const WorkPeriodController = {
    listWorkPeriods,
    getActiveWorkPeriod,
    getWorkPeriodById,
    openWorkPeriod,
    closeWorkPeriod,
};
