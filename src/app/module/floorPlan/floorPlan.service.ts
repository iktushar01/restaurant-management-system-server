import { prisma } from "../../lib/prisma";
import { DineTableStatus } from "../../lib/prisma-exports";

export const CANVAS_WIDTH = 1400;
export const CANVAS_HEIGHT = 900;
export const GRID_SIZE = 10;
export const DEFAULT_ZONE_WIDTH = 300;
export const DEFAULT_ZONE_HEIGHT = 220;
export const DEFAULT_TABLE_SIZE = 72;

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

const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const getFloorPlan = async () => {
    const [locations, tables] = await Promise.all([
        prisma.dineLocation.findMany({
            where: { isDeleted: false },
            orderBy: { name: "asc" },
        }),
        prisma.dineTable.findMany({
            where: { isDeleted: false },
            include: { location: { select: { name: true } } },
            orderBy: { tableNo: "asc" },
        }),
    ]);

    const formattedLocations = locations.map((location, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const defaultX = snap(40 + col * (DEFAULT_ZONE_WIDTH + 30));
        const defaultY = snap(40 + row * (DEFAULT_ZONE_HEIGHT + 30));

        return {
            id: location.id,
            name: location.name,
            type: location.type ?? "",
            positionX: location.positionX ?? defaultX,
            positionY: location.positionY ?? defaultY,
            width: location.width ?? DEFAULT_ZONE_WIDTH,
            height: location.height ?? DEFAULT_ZONE_HEIGHT,
            hasSavedPosition: location.positionX != null && location.positionY != null,
        };
    });

    const locationMap = new Map(formattedLocations.map((loc) => [loc.id, loc]));

    const formattedTables = tables.map((table, index) => {
        const zone = locationMap.get(table.locationId);
        const tablesInZone = tables.filter((t) => t.locationId === table.locationId);
        const indexInZone = tablesInZone.findIndex((t) => t.id === table.id);
        const cols = 4;
        const col = indexInZone % cols;
        const row = Math.floor(indexInZone / cols);
        const defaultX = zone
            ? snap(zone.positionX + 20 + col * (DEFAULT_TABLE_SIZE + 12))
            : snap(40 + (index % 6) * (DEFAULT_TABLE_SIZE + 16));
        const defaultY = zone
            ? snap(zone.positionY + 50 + row * (DEFAULT_TABLE_SIZE + 12))
            : snap(CANVAS_HEIGHT - 160 + Math.floor(index / 6) * (DEFAULT_TABLE_SIZE + 12));

        return {
            id: table.id,
            tableNo: table.tableNo,
            capacity: table.capacity,
            locationId: table.locationId,
            locationName: table.location.name,
            status: formatStatus(table.status),
            statusRaw: table.status,
            positionX: table.positionX ?? defaultX,
            positionY: table.positionY ?? defaultY,
            hasSavedPosition: table.positionX != null && table.positionY != null,
        };
    });

    return {
        canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, gridSize: GRID_SIZE },
        locations: formattedLocations,
        tables: formattedTables,
    };
};

const resetFloorPlan = async () => {
    await prisma.$transaction([
        prisma.dineLocation.updateMany({
            where: { isDeleted: false },
            data: { positionX: null, positionY: null, width: null, height: null },
        }),
        prisma.dineTable.updateMany({
            where: { isDeleted: false },
            data: { positionX: null, positionY: null },
        }),
    ]);

    return getFloorPlan();
};

export const FloorPlanService = {
    getFloorPlan,
    resetFloorPlan,
};
