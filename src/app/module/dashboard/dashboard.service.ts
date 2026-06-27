import { prisma } from "../../lib/prisma";
import { DineTableStatus } from "../../lib/prisma-exports";

const inferSeatType = (tableNo: string) => {
    const name = tableNo.toLowerCase();
    if (name.includes("kabin")) return "kabin";
    if (name.includes("box")) return "box";
    if (name.includes("take")) return "takeaway";
    return "table";
};

const getSeatLayout = async () => {
    const tables = await prisma.dineTable.findMany({
        where: { isDeleted: false },
        include: { location: { select: { name: true } } },
        orderBy: { tableNo: "asc" },
    });

    return tables.map((table) => ({
        id: table.id,
        seatName: table.tableNo,
        type: inferSeatType(table.tableNo),
        status: table.status,
        statusLabel:
            table.status === DineTableStatus.AVAILABLE
                ? "Vacant"
                : table.status === DineTableStatus.OCCUPIED
                  ? "Occupied"
                  : "Reserved",
        capacity: table.capacity,
        location: table.location.name,
    }));
};

export const DashboardService = {
    getSeatLayout,
};
