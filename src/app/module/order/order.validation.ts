import { z } from "zod";
import { OrderStatus, OrderType } from "../../lib/prisma-exports";

const orderItemSchema = z.object({
    foodId: z.string().uuid(),
    quantity: z.coerce.number().int().min(1),
    sideDish: z.string().optional(),
    sideDishQty: z.coerce.number().int().optional(),
    note: z.string().optional(),
    price: z.coerce.number().min(0),
});

export const createOrderZodSchema = z.object({
    orderType: z.nativeEnum(OrderType),
    tableId: z.string().uuid().optional(),
    tableIds: z.array(z.string().uuid()).optional(),
    waiterId: z.string().uuid(),
    persons: z.coerce.number().int().optional(),
    notes: z.string().optional(),
    items: z.array(orderItemSchema).min(1),
});

export const updateOrderStatusZodSchema = z.object({
    status: z.nativeEnum(OrderStatus),
});

export const orderIdZodSchema = z.object({
    id: z.string().uuid(),
});

export const listOrderQuerySchema = z.object({
    status: z.nativeEnum(OrderStatus).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
