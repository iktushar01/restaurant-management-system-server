import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DineTableService } from "./dineTable.service";

const listDineTables = catchAsync(async (req: Request, res: Response) => {
    const result = await DineTableService.listDineTables(req.query as any);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine tables fetched successfully",
        data: result.tables,
        meta: result.meta,
    });
});

const getAllDineTables = catchAsync(async (_req: Request, res: Response) => {
    const result = await DineTableService.getAllDineTables();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine tables fetched successfully",
        data: result,
    });
});

const getDineTableById = catchAsync(async (req: Request, res: Response) => {
    const result = await DineTableService.getDineTableById(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine table fetched successfully",
        data: result,
    });
});

const createDineTable = catchAsync(async (req: Request, res: Response) => {
    const result = await DineTableService.createDineTable(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Dine table created successfully",
        data: result,
    });
});

const updateDineTable = catchAsync(async (req: Request, res: Response) => {
    const result = await DineTableService.updateDineTable(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine table updated successfully",
        data: result,
    });
});

const updateDineTableStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await DineTableService.updateDineTableStatus(req.params.id, req.body.status);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine table status updated successfully",
        data: result,
    });
});

const deleteDineTable = catchAsync(async (req: Request, res: Response) => {
    await DineTableService.deleteDineTable(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Dine table deleted successfully",
        data: null,
    });
});

export const DineTableController = {
    listDineTables,
    getAllDineTables,
    getDineTableById,
    createDineTable,
    updateDineTable,
    updateDineTableStatus,
    deleteDineTable,
};
