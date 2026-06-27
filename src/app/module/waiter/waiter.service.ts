import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";

interface IListWaiters {
    search?: string;
    page?: number;
    limit?: number;
}

const formatWaiter = (waiter: { id: string; name: string; note: string | null }) => ({
    id: waiter.id,
    ID: waiter.id,
    name: waiter.name,
    note: waiter.note ?? "",
});

const listWaiters = async (query: IListWaiters) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
        isDeleted: false,
        ...(query.search
            ? { name: { contains: query.search, mode: "insensitive" as const } }
            : {}),
    };

    const [waiters, total] = await Promise.all([
        prisma.waiter.findMany({ where, orderBy: { name: "asc" }, skip, take: limit }),
        prisma.waiter.count({ where }),
    ]);

    return {
        waiters: waiters.map(formatWaiter),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getAllWaiters = async () => {
    const waiters = await prisma.waiter.findMany({
        where: { isDeleted: false },
        orderBy: { name: "asc" },
    });
    return waiters.map(formatWaiter);
};

const getWaiterById = async (id: string) => {
    const waiter = await prisma.waiter.findFirst({ where: { id, isDeleted: false } });
    if (!waiter) throw new AppError(StatusCodes.NOT_FOUND, "Waiter not found");
    return formatWaiter(waiter);
};

const createWaiter = async (payload: { name: string; note?: string }) => {
    const waiter = await prisma.waiter.create({
        data: { name: payload.name, note: payload.note ?? "" },
    });
    return formatWaiter(waiter);
};

const updateWaiter = async (id: string, payload: { name?: string; note?: string }) => {
    await getWaiterById(id);
    const waiter = await prisma.waiter.update({ where: { id }, data: payload });
    return formatWaiter(waiter);
};

const deleteWaiter = async (id: string) => {
    await getWaiterById(id);
    return prisma.waiter.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() },
    });
};

export const WaiterService = {
    listWaiters,
    getAllWaiters,
    getWaiterById,
    createWaiter,
    updateWaiter,
    deleteWaiter,
};
