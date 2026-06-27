import { z } from "zod";

export const createDineLocationZodSchema = z.object({
    name: z.string().min(2),
    type: z.string().optional(),
});

export const updateDineLocationZodSchema = createDineLocationZodSchema.partial();

export const dineLocationIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listDineLocationQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
