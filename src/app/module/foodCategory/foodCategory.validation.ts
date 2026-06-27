import { z } from "zod";

export const createFoodCategoryZodSchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
    note: z.string().optional(),
    serialNo: z.coerce.number().int().min(1),
});

export const updateFoodCategoryZodSchema = createFoodCategoryZodSchema.partial();

export const foodCategoryIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listFoodCategoryQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
