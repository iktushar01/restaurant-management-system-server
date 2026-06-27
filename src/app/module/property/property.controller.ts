import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PropertyService } from "./property.service";

const getProperty = catchAsync(async (_req: Request, res: Response) => {
    const result = await PropertyService.getProperty();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Property information fetched successfully",
        data: result,
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyService.updateProperty(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Property information updated successfully",
        data: result,
    });
});

export const PropertyController = {
    getProperty,
    updateProperty,
};
