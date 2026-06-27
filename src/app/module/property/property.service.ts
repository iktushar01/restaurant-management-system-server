import { prisma } from "../../lib/prisma";

const getProperty = async () => {
    let property = await prisma.property.findFirst();

    if (!property) {
        property = await prisma.property.create({
            data: {
                propertyName: "DineFlow Restaurant",
            },
        });
    }

    return property;
};

const updateProperty = async (payload: Record<string, string | undefined>) => {
    const existing = await getProperty();

    return prisma.property.update({
        where: { id: existing.id },
        data: payload,
    });
};

export const PropertyService = {
    getProperty,
    updateProperty,
};
