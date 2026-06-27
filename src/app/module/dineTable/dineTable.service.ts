import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { DineTableStatus } from "../../lib/prisma-exports";
import { StatusCodes } from "http-status-codes";

interface IListDineTables {
    search?: string;
    locationId?: string;
    page?: number;
    limit?: number;
}

const formatStatus = (status: DineTableStatus) => {
    switch (status) {
        case DineTableStatus.AVAILABLE:
            return "Vacant";
        case DineTableStatus.OCCUPIED:
            return "Occupied";
        case DineTableStatus.RESERVED:
            return "Reserved";
        default:
            return "Vacant";
    }
};

const formatTable = (table: {
    id: string;
    locationId: string;
    tableNo: string;
    capacity: number;
    status: DineTableStatus;
    location?: { name: string };
}) => ({
    id: table.id,
    locationId: table.locationId,
    location: table.location?.name ?? "",
    tableNo: table.tableNo,
    capacity: table.capacity,
    status: formatStatus(table.status),
    statusRaw: table.status,
});

const listDineTables = async (query: IListDineTables) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
        isDeleted: false,
        ...(query.locationId ? { locationId: query.locationId } : {}),
        ...(query.search
            ? {
                  OR: [
                      { tableNo: { contains: query.search, mode: "insensitive" as const } },
                      {
                          location: {
                              name: { contains: query.search, mode: "insensitive" as const },
                          },
                      },
                      { status: { equals: query.search.toUpperCase() as DineTableStatus } },
                  ],
              }
            : {}),
    };

    const [tables, total] = await Promise.all([
        prisma.dineTable.findMany({
            where,
            include: { location: { select: { name: true } } },
            orderBy: { tableNo: "asc" },
            skip,
            take: limit,
        }),
        prisma.dineTable.count({ where }),
    ]);

    return {
        tables: tables.map(formatTable),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getAllDineTables = async () => {
    const tables = await prisma.dineTable.findMany({
        where: { isDeleted: false },
        include: { location: { select: { name: true } } },
        orderBy: { tableNo: "asc" },
    });
    return tables.map(formatTable);
};

const getDineTableById = async (id: string) => {
    const table = await prisma.dineTable.findFirst({
        where: { id, isDeleted: false },
        include: { location: { select: { name: true } } },
    });

    if (!table) {
        throw new AppError(StatusCodes.NOT_FOUND, "Dine table not found");
    }

    return formatTable(table);
};

const createDineTable = async (payload: {
    locationId: string;
    tableNo: string;
    capacity: number;
    status?: DineTableStatus;
}) => {
    const location = await prisma.dineLocation.findFirst({
        where: { id: payload.locationId, isDeleted: false },
    });

    if (!location) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Dine location not found");
    }

    const table = await prisma.dineTable.create({
        data: {
            locationId: payload.locationId,
            tableNo: payload.tableNo,
            capacity: payload.capacity,
            status: payload.status ?? DineTableStatus.AVAILABLE,
        },
        include: { location: { select: { name: true } } },
    });

    return formatTable(table);
};

const updateDineTable = async (
    id: string,
    payload: Partial<{
        locationId: string;
        tableNo: string;
        capacity: number;
        status: DineTableStatus;
    }>,
) => {
    await getDineTableById(id);

    if (payload.locationId) {
        const location = await prisma.dineLocation.findFirst({
            where: { id: payload.locationId, isDeleted: false },
        });
        if (!location) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Dine location not found");
        }
    }

    const table = await prisma.dineTable.update({
        where: { id },
        data: payload,
        include: { location: { select: { name: true } } },
    });

    return formatTable(table);
};

const updateDineTableStatus = async (id: string, status: DineTableStatus) => {
    await getDineTableById(id);
    const table = await prisma.dineTable.update({
        where: { id },
        data: { status },
        include: { location: { select: { name: true } } },
    });
    return formatTable(table);
};

const deleteDineTable = async (id: string) => {
    await getDineTableById(id);
    return prisma.dineTable.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() },
    });
};

export const DineTableService = {
    listDineTables,
    getAllDineTables,
    getDineTableById,
    createDineTable,
    updateDineTable,
    updateDineTableStatus,
    deleteDineTable,
};
