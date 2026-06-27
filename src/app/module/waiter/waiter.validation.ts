import { z } from "zod";

export const createWaiterZodSchema = z.object({
    name: z.string().min(2),
    note: z.string().optional(),
});

export const updateWaiterZodSchema = createWaiterZodSchema.partial();

export const waiterIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listWaiterQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
