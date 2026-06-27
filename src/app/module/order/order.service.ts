import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
    DineTableStatus,
    OrderStatus,
    OrderType,
    WorkPeriodStatus,
} from "../../lib/prisma-exports";
import { StatusCodes } from "http-status-codes";

interface IOrderItem {
    foodId: string;
    quantity: number;
    sideDish?: string;
    sideDishQty?: number;
    note?: string;
    price: number;
}

interface ICreateOrder {
    orderType: OrderType;
    tableId?: string;
    tableIds?: string[];
    waiterId: string;
    persons?: number;
    notes?: string;
    items: IOrderItem[];
}

const formatOrderStatus = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PENDING:
        case OrderStatus.PREPARING:
            return "Ordered ✓";
        case OrderStatus.READY:
        case OrderStatus.SERVED:
            return "Served";
        case OrderStatus.COMPLETED:
            return "Completed";
        case OrderStatus.CANCELLED:
            return "Cancelled";
        default:
            return status;
    }
};

const formatOrder = (order: {
    id: string;
    orderType: OrderType;
    status: OrderStatus;
    total: { toString: () => string };
    persons: number | null;
    notes: string | null;
    createdAt: Date;
    table?: { tableNo: string } | null;
    waiter?: { name: string } | null;
    items?: { food: { name: string }; quantity: number }[];
}) => ({
    id: order.id,
    orderId: order.id.slice(0, 8).toUpperCase(),
    table: order.table?.tableNo ?? "Takeaway",
    status: formatOrderStatus(order.status),
    statusRaw: order.status,
    billAmount: Number(order.total),
    total: Number(order.total),
    orderType: order.orderType,
    persons: order.persons,
    notes: order.notes,
    waiter: order.waiter?.name ?? "",
    orderTime: order.createdAt.toLocaleTimeString("en-GB"),
    items: order.items?.map((item) => `${item.food.name} x${item.quantity}`) ?? [],
});

const getOrCreateActiveWorkPeriod = async () => {
    let period = await prisma.workPeriod.findFirst({
        where: { status: WorkPeriodStatus.OPEN },
        orderBy: { startDate: "desc" },
    });

    if (!period) {
        period = await prisma.workPeriod.create({
            data: { startDate: new Date(), openingCash: 0 },
        });
    }

    return period;
};

const listOrders = async (query: { status?: OrderStatus; page?: number; limit?: number }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
        ...(query.status ? { status: query.status } : {}),
    };

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                table: { select: { tableNo: true } },
                waiter: { select: { name: true } },
                items: { include: { food: { select: { name: true } } } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.order.count({ where }),
    ]);

    return {
        orders: orders.map(formatOrder),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getCurrentOrders = async () => {
    const orders = await prisma.order.findMany({
        where: {
            status: {
                notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
            },
        },
        include: {
            table: { select: { tableNo: true } },
            waiter: { select: { name: true } },
            items: { include: { food: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });

    return orders.map(formatOrder);
};

const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            table: { select: { tableNo: true } },
            waiter: { select: { name: true } },
            items: { include: { food: { select: { name: true } } } },
        },
    });

    if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
    return formatOrder(order);
};

const createOrder = async (payload: ICreateOrder) => {
    const waiter = await prisma.waiter.findFirst({
        where: { id: payload.waiterId, isDeleted: false },
    });
    if (!waiter) throw new AppError(StatusCodes.BAD_REQUEST, "Waiter not found");

    const primaryTableId = payload.tableId ?? payload.tableIds?.[0];
    let tableNote = "";

    if (payload.tableIds && payload.tableIds.length > 1) {
        const tables = await prisma.dineTable.findMany({
            where: { id: { in: payload.tableIds }, isDeleted: false },
            select: { tableNo: true },
        });
        tableNote = `Tables: ${tables.map((t) => t.tableNo).join(", ")}`;
    }

    if (primaryTableId) {
        const table = await prisma.dineTable.findFirst({
            where: { id: primaryTableId, isDeleted: false },
        });
        if (!table) throw new AppError(StatusCodes.BAD_REQUEST, "Table not found");
    }

    const subtotal = payload.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const workPeriod = await getOrCreateActiveWorkPeriod();

    const combinedNotes = [payload.notes, tableNote].filter(Boolean).join(" | ");

    const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                orderType: payload.orderType,
                tableId: primaryTableId ?? null,
                waiterId: payload.waiterId,
                workPeriodId: workPeriod.id,
                persons: payload.persons,
                notes: combinedNotes || null,
                subtotal,
                total: subtotal,
                status: OrderStatus.PENDING,
                items: {
                    create: payload.items.map((item) => ({
                        foodId: item.foodId,
                        quantity: item.quantity,
                        sideDish: item.sideDish ?? null,
                        sideDishQty: item.sideDishQty ?? null,
                        note: item.note ?? null,
                        price: item.price,
                    })),
                },
            },
            include: {
                table: { select: { tableNo: true } },
                waiter: { select: { name: true } },
                items: { include: { food: { select: { name: true } } } },
            },
        });

        if (primaryTableId && payload.orderType === OrderType.DINE_IN) {
            await tx.dineTable.update({
                where: { id: primaryTableId },
                data: { status: DineTableStatus.OCCUPIED },
            });
        }

        await tx.workPeriod.update({
            where: { id: workPeriod.id },
            data: { totalSale: { increment: subtotal } },
        });

        return created;
    });

    return formatOrder(order);
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: { table: true },
    });

    if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");

    const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.order.update({
            where: { id },
            data: { status },
            include: {
                table: { select: { tableNo: true } },
                waiter: { select: { name: true } },
                items: { include: { food: { select: { name: true } } } },
            },
        });

        if (
            order.tableId &&
            (status === OrderStatus.COMPLETED || status === OrderStatus.CANCELLED)
        ) {
            await tx.dineTable.update({
                where: { id: order.tableId },
                data: { status: DineTableStatus.AVAILABLE },
            });
        }

        return result;
    });

    return formatOrder(updated);
};

const cancelOrder = async (id: string) => updateOrderStatus(id, OrderStatus.CANCELLED);

export const OrderService = {
    listOrders,
    getCurrentOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
};
