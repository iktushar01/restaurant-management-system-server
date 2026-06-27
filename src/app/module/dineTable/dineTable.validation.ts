import { z } from "zod";
import { DineTableStatus } from "../../lib/prisma-exports";

export const createDineTableZodSchema = z.object({
    locationId: z.string().uuid(),
    tableNo: z.string().min(1),
    capacity: z.coerce.number().int().min(1),
    status: z.nativeEnum(DineTableStatus).optional().default(DineTableStatus.AVAILABLE),
    positionX: z.number().int().nullable().optional(),
    positionY: z.number().int().nullable().optional(),
});

export const updateDineTableZodSchema = createDineTableZodSchema.partial();

export const dineTableIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listDineTableQuerySchema = z.object({
    search: z.string().optional(),
    locationId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const updateDineTableStatusZodSchema = z.object({
    status: z.nativeEnum(DineTableStatus),
});
