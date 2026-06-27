import { z } from "zod";

export const createCurrencyZodSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2).max(8),
    symbol: z.string().min(1).max(8),
    symbolPosition: z.enum(["BEFORE", "AFTER"]).optional().default("BEFORE"),
    decimalPlaces: z.coerce.number().int().min(0).max(4).optional().default(2),
    isDefault: z.boolean().optional(),
});

export const updateCurrencyZodSchema = createCurrencyZodSchema.partial();

export const currencyIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listCurrencyQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
