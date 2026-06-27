import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { FoodService } from "./food.service";

const listFoods = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodService.listFoods(req.query as any);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food items fetched successfully",
        data: result.foods,
        meta: result.meta,
    });
});

const getAllFoods = catchAsync(async (_req: Request, res: Response) => {
    const result = await FoodService.getAllFoods();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food items fetched successfully",
        data: result,
    });
});

const getFoodById = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodService.getFoodById(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food item fetched successfully",
        data: result,
    });
});

const createFood = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodService.createFood(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Food item created successfully",
        data: result,
    });
});

const updateFood = catchAsync(async (req: Request, res: Response) => {
    const result = await FoodService.updateFood(req.params.id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food item updated successfully",
        data: result,
    });
});

const deleteFood = catchAsync(async (req: Request, res: Response) => {
    await FoodService.deleteFood(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Food item deleted successfully",
        data: null,
    });
});

export const FoodController = {
    listFoods,
    getAllFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
};
