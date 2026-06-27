import { prisma } from "../../lib/prisma";
import { OrderStatus, WorkPeriodStatus } from "../../lib/prisma-exports";
import { FloorPlanService } from "../floorPlan/floorPlan.service";

const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getOrderScope = async () => {
    const openPeriod = await prisma.workPeriod.findFirst({
        where: { status: WorkPeriodStatus.OPEN },
        orderBy: { startDate: "desc" },
    });

    if (openPeriod) {
        return { workPeriodId: openPeriod.id };
    }

    return {
        createdAt: { gte: startOfToday() },
    };
};

const getDashboardStats = async () => {
    const scope = await getOrderScope();

    const [inOrder, currentlyServed, cancelled, completed] = await Promise.all([
        prisma.order.count({
            where: {
                ...scope,
                status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING] },
            },
        }),
        prisma.order.count({
            where: {
                ...scope,
                status: { in: [OrderStatus.READY, OrderStatus.SERVED] },
            },
        }),
        prisma.order.count({
            where: {
                ...scope,
                status: OrderStatus.CANCELLED,
            },
        }),
        prisma.order.count({
            where: {
                ...scope,
                status: OrderStatus.COMPLETED,
            },
        }),
    ]);

    return { inOrder, currentlyServed, cancelled, completed };
};

const getSeatLayout = async () => {
    const floorPlan = await FloorPlanService.getFloorPlan();
    return floorPlan;
};

export const DashboardService = {
    getDashboardStats,
    getSeatLayout,
};
