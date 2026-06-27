import { z } from "zod";
import { Availability } from "../../lib/prisma-exports";

export const createFoodZodSchema = z.object({
    categoryId: z.string().uuid(),
    foodNo: z.string().min(1),
    name: z.string().min(2),
    serialNo: z.coerce.number().int().min(1),
    availability: z.nativeEnum(Availability).optional().default(Availability.AVAILABLE),
    price: z.coerce.number().min(0),
    image: z.string().url().optional().or(z.literal("")),
});

export const updateFoodZodSchema = createFoodZodSchema.partial();

export const foodIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listFoodQuerySchema = z.object({
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
