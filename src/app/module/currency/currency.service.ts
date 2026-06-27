import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";

interface IListCurrencies {
    search?: string;
    page?: number;
    limit?: number;
}

const listCurrencies = async (query: IListCurrencies) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
        isDeleted: false,
        ...(query.search
            ? {
                  OR: [
                      { name: { contains: query.search, mode: "insensitive" as const } },
                      { code: { contains: query.search, mode: "insensitive" as const } },
                      { symbol: { contains: query.search, mode: "insensitive" as const } },
                  ],
              }
            : {}),
    };

    const [currencies, total] = await Promise.all([
        prisma.currency.findMany({
            where,
            orderBy: [{ isDefault: "desc" }, { name: "asc" }],
            skip,
            take: limit,
        }),
        prisma.currency.count({ where }),
    ]);

    return {
        currencies,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getAllCurrencies = async () =>
    prisma.currency.findMany({
        where: { isDeleted: false },
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

const getCurrencyById = async (id: string) => {
    const currency = await prisma.currency.findFirst({
        where: { id, isDeleted: false },
    });

    if (!currency) {
        throw new AppError(StatusCodes.NOT_FOUND, "Currency not found");
    }

    return currency;
};

const getDefaultCurrency = async () => {
    let currency = await prisma.currency.findFirst({
        where: { isDefault: true, isDeleted: false },
    });

    if (!currency) {
        currency = await prisma.currency.findFirst({
            where: { isDeleted: false },
            orderBy: { createdAt: "asc" },
        });
    }

    if (!currency) {
        currency = await prisma.currency.create({
            data: {
                name: "US Dollar",
                code: "USD",
                symbol: "$",
                symbolPosition: "BEFORE",
                decimalPlaces: 2,
                isDefault: true,
            },
        });
    }

    return currency;
};

const unsetOtherDefaults = async (exceptId?: string) => {
    await prisma.currency.updateMany({
        where: {
            isDeleted: false,
            ...(exceptId ? { id: { not: exceptId } } : {}),
        },
        data: { isDefault: false },
    });
};

const createCurrency = async (payload: {
    name: string;
    code: string;
    symbol: string;
    symbolPosition?: string;
    decimalPlaces?: number;
    isDefault?: boolean;
}) => {
    const count = await prisma.currency.count({ where: { isDeleted: false } });
    const isDefault = payload.isDefault ?? count === 0;

    if (isDefault) {
        await unsetOtherDefaults();
    }

    return prisma.currency.create({
        data: {
            name: payload.name,
            code: payload.code.toUpperCase(),
            symbol: payload.symbol,
            symbolPosition: payload.symbolPosition ?? "BEFORE",
            decimalPlaces: payload.decimalPlaces ?? 2,
            isDefault,
        },
    });
};

const updateCurrency = async (
    id: string,
    payload: Partial<{
        name: string;
        code: string;
        symbol: string;
        symbolPosition: string;
        decimalPlaces: number;
        isDefault: boolean;
    }>,
) => {
    await getCurrencyById(id);

    const data = {
        ...payload,
        ...(payload.code ? { code: payload.code.toUpperCase() } : {}),
    };

    if (payload.isDefault) {
        await unsetOtherDefaults(id);
    }

    return prisma.currency.update({ where: { id }, data });
};

const setDefaultCurrency = async (id: string) => {
    await getCurrencyById(id);
    await unsetOtherDefaults(id);
    return prisma.currency.update({
        where: { id },
        data: { isDefault: true },
    });
};

const deleteCurrency = async (id: string) => {
    const currency = await getCurrencyById(id);

    if (currency.isDefault) {
        const otherCount = await prisma.currency.count({
            where: { isDeleted: false, id: { not: id } },
        });
        if (otherCount === 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Cannot delete the only currency. Add another default first.",
            );
        }
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Set another currency as default before deleting this one.",
        );
    }

    return prisma.currency.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() },
    });
};

export const CurrencyService = {
    listCurrencies,
    getAllCurrencies,
    getCurrencyById,
    getDefaultCurrency,
    createCurrency,
    updateCurrency,
    setDefaultCurrency,
    deleteCurrency,
};
