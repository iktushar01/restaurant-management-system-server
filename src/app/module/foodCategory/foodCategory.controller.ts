import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { FoodCategoryService } from "./foodCategory.service";

const listFoodCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodCategoryService.listFoodCategories(req.query as any);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food categories fetched successfully",
        data: result.categories,
        meta: result.meta,
    });
});

const getAllFoodCategories = catchAsync(async (_req: Request, res: Response) => {
    const result = await FoodCategoryService.getAllFoodCategories();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food categories fetched successfully",
        data: result,
    });
});

const getFoodCategoryById = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodCategoryService.getFoodCategoryById(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food category fetched successfully",
        data: result,
    });
});

const createFoodCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodCategoryService.createFoodCategory(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Food category created successfully",
        data: result,
    });
});

const updateFoodCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodCategoryService.updateFoodCategory(req.params.id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food category updated successfully",
        data: result,
    });
});

const deleteFoodCategory = catchAsync(async (req: Request, res: Response) => {
    await FoodCategoryService.deleteFoodCategory(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food category deleted successfully",
        data: null,
    });
});

export const FoodCategoryController = {
    listFoodCategories,
    getAllFoodCategories,
    getFoodCategoryById,
    createFoodCategory,
    updateFoodCategory,
    deleteFoodCategory,
};
