import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";

interface IListDineLocations {
    search?: string;
    page?: number;
    limit?: number;
}

const listDineLocations = async (query: IListDineLocations) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
        isDeleted: false,
        ...(query.search
            ? {
                  OR: [
                      { name: { contains: query.search, mode: "insensitive" as const } },
                      { type: { contains: query.search, mode: "insensitive" as const } },
                  ],
              }
            : {}),
    };

    const [locations, total] = await Promise.all([
        prisma.dineLocation.findMany({
            where,
            orderBy: { name: "asc" },
            skip,
            take: limit,
        }),
        prisma.dineLocation.count({ where }),
    ]);

    return {
        locations,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getAllDineLocations = async () =>
    prisma.dineLocation.findMany({
        where: { isDeleted: false },
        orderBy: { name: "asc" },
    });

const getDineLocationById = async (id: string) => {
    const location = await prisma.dineLocation.findFirst({
        where: { id, isDeleted: false },
    });

    if (!location) {
        throw new AppError(StatusCodes.NOT_FOUND, "Dine location not found");
    }

    return location;
};

const createDineLocation = async (payload: { name: string; type?: string }) =>
    prisma.dineLocation.create({
        data: { name: payload.name, type: payload.type ?? "" },
    });

const updateDineLocation = async (
    id: string,
    payload: { name?: string; type?: string },
) => {
    await getDineLocationById(id);
    return prisma.dineLocation.update({ where: { id }, data: payload });
};

const deleteDineLocation = async (id: string) => {
    await getDineLocationById(id);

    const tableCount = await prisma.dineTable.count({
        where: { locationId: id, isDeleted: false },
    });

    if (tableCount > 0) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Cannot delete location with existing tables",
        );
    }

    return prisma.dineLocation.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() },
    });
};

export const DineLocationService = {
    listDineLocations,
    getAllDineLocations,
    getDineLocationById,
    createDineLocation,
    updateDineLocation,
    deleteDineLocation,
};
