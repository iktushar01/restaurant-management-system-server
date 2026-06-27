import { z } from "zod";

export const createWorkPeriodZodSchema = z.object({
    openingCash: z.coerce.number().min(0).optional().default(0),
});

export const closeWorkPeriodZodSchema = z.object({
    closingCash: z.coerce.number().min(0),
});

export const workPeriodIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listWorkPeriodQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
