import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { WorkPeriodStatus } from "../../lib/prisma-exports";
import { StatusCodes } from "http-status-codes";

const formatWorkPeriod = (wp: {
    id: string;
    startDate: Date;
    endDate: Date | null;
    openingCash: { toString: () => string };
    totalSale: { toString: () => string };
    discount: { toString: () => string };
    cashPayment: { toString: () => string };
    cardPayment: { toString: () => string };
    totalPaid: { toString: () => string };
    onTheHouse: { toString: () => string };
    closingCash: { toString: () => string };
    status: WorkPeriodStatus;
}) => ({
    id: wp.id,
    ID: wp.id,
    startDate: wp.startDate.toLocaleString("en-GB"),
    endDate: wp.endDate ? wp.endDate.toLocaleString("en-GB") : "",
    openingCash: Number(wp.openingCash).toFixed(2),
    totalSale: Number(wp.totalSale).toFixed(2),
    discount: Number(wp.discount).toFixed(2),
    cashPayment: Number(wp.cashPayment).toFixed(2),
    cardPayment: Number(wp.cardPayment).toFixed(2),
    totalPaid: Number(wp.totalPaid).toFixed(2),
    onTheHouse: Number(wp.onTheHouse).toFixed(2),
    closingCash: wp.endDate ? Number(wp.closingCash).toFixed(2) : "",
    status: wp.status === WorkPeriodStatus.OPEN ? "Active" : "Closed",
    statusRaw: wp.status,
});

const getActiveWorkPeriod = async () =>
    prisma.workPeriod.findFirst({
        where: { status: WorkPeriodStatus.OPEN },
        orderBy: { startDate: "desc" },
    });

const listWorkPeriods = async (query: { page?: number; limit?: number }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [periods, total] = await Promise.all([
        prisma.workPeriod.findMany({ orderBy: { startDate: "desc" }, skip, take: limit }),
        prisma.workPeriod.count(),
    ]);

    return {
        periods: periods.map(formatWorkPeriod),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getWorkPeriodById = async (id: string) => {
    const period = await prisma.workPeriod.findUnique({ where: { id } });
    if (!period) throw new AppError(StatusCodes.NOT_FOUND, "Work period not found");
    return formatWorkPeriod(period);
};

const openWorkPeriod = async (openingCash = 0) => {
    const active = await getActiveWorkPeriod();
    if (active) {
        throw new AppError(StatusCodes.BAD_REQUEST, "A work period is already open");
    }

    const period = await prisma.workPeriod.create({
        data: { startDate: new Date(), openingCash },
    });

    return formatWorkPeriod(period);
};

const closeWorkPeriod = async (id: string, closingCash: number) => {
    const period = await prisma.workPeriod.findUnique({ where: { id } });
    if (!period) throw new AppError(StatusCodes.NOT_FOUND, "Work period not found");
    if (period.status === WorkPeriodStatus.CLOSED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Work period is already closed");
    }

    const updated = await prisma.workPeriod.update({
        where: { id },
        data: {
            endDate: new Date(),
            closingCash,
            status: WorkPeriodStatus.CLOSED,
        },
    });

    return formatWorkPeriod(updated);
};

export const WorkPeriodService = {
    listWorkPeriods,
    getWorkPeriodById,
    getActiveWorkPeriod,
    openWorkPeriod,
    closeWorkPeriod,
};
