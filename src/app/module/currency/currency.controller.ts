import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { CurrencyService } from "./currency.service";

const listCurrencies = catchAsync(async (req: Request, res: Response) => {
    const result = await CurrencyService.listCurrencies(req.query as any);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Currencies fetched successfully",
        data: result.currencies,
        meta: result.meta,
    });
});

const getAllCurrencies = catchAsync(async (_req: Request, res: Response) => {
    const result = await CurrencyService.getAllCurrencies();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Currencies fetched successfully",
        data: result,
    });
});

const getDefaultCurrency = catchAsync(async (_req: Request, res: Response) => {
    const result = await CurrencyService.getDefaultCurrency();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Default currency fetched successfully",
        data: result,
    });
});

const getCurrencyById = catchAsync(async (req: Request, res: Response) => {
    const result = await CurrencyService.getCurrencyById(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Currency fetched successfully",
        data: result,
    });
});

const createCurrency = catchAsync(async (req: Request, res: Response) => {
    const result = await CurrencyService.createCurrency(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Currency created successfully",
        data: result,
    });
});

const updateCurrency = catchAsync(async (req: Request, res: Response) => {
    const result = await CurrencyService.updateCurrency(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Currency updated successfully",
        data: result,
    });
});

const setDefaultCurrency = catchAsync(async (req: Request, res: Response) => {
    const result = await CurrencyService.setDefaultCurrency(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Default currency updated successfully",
        data: result,
    });
});

const deleteCurrency = catchAsync(async (req: Request, res: Response) => {
    await CurrencyService.deleteCurrency(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Currency deleted successfully",
        data: null,
    });
});

export const CurrencyController = {
    listCurrencies,
    getAllCurrencies,
    getDefaultCurrency,
    getCurrencyById,
    createCurrency,
    updateCurrency,
    setDefaultCurrency,
    deleteCurrency,
};
