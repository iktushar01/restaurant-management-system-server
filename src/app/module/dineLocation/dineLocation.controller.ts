import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DineLocationService } from "./dineLocation.service";

const listDineLocations = catchAsync(async (req: Request, res: Response) => {
    const result = await DineLocationService.listDineLocations(req.query as any);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine locations fetched successfully",
        data: result.locations,
        meta: result.meta,
    });
});

const getAllDineLocations = catchAsync(async (_req: Request, res: Response) => {
    const result = await DineLocationService.getAllDineLocations();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine locations fetched successfully",
        data: result,
    });
});

const getDineLocationById = catchAsync(async (req: Request, res: Response) => {
    const result = await DineLocationService.getDineLocationById(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine location fetched successfully",
        data: result,
    });
});

const createDineLocation = catchAsync(async (req: Request, res: Response) => {
    const result = await DineLocationService.createDineLocation(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Dine location created successfully",
        data: result,
    });
});

const updateDineLocation = catchAsync(async (req: Request, res: Response) => {
    const result = await DineLocationService.updateDineLocation(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine location updated successfully",
        data: result,
    });
});

const deleteDineLocation = catchAsync(async (req: Request, res: Response) => {
    await DineLocationService.deleteDineLocation(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine location deleted successfully",
        data: null,
    });
});

export const DineLocationController = {
    listDineLocations,
    getAllDineLocations,
    getDineLocationById,
    createDineLocation,
    updateDineLocation,
    deleteDineLocation,
};
