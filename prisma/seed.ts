import { PrismaClient, Availability } from "../src/generated/prisma/index";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
    { name: "Appetizer (Thai)", note: "", serialNo: 1 },
    { name: "Salad (Thai)", note: "", serialNo: 2 },
    { name: "Soup (Thai)", note: "", serialNo: 3 },
    { name: "Rice (Thai)", note: "", serialNo: 4 },
    { name: "Noodles (Thai)", note: "", serialNo: 5 },
    { name: "Beef (Thai)", note: "", serialNo: 6 },
    { name: "Chicken (Thai)", note: "", serialNo: 7 },
    { name: "Seafood (Thai)", note: "", serialNo: 8 },
    { name: "Vegetarian (Thai)", note: "", serialNo: 9 },
    { name: "Dessert (Thai)", note: "", serialNo: 10 },
];

const foods = [
    { foodNo: "01", name: "Chicken Saizy", serialNo: 1, price: 395 },
    { foodNo: "02", name: "Fried/Grilled Chicken Wings", serialNo: 2, price: 330 },
    { foodNo: "03", name: "Fish Finger (Fish Chup Pang Tod)", serialNo: 3, price: 360 },
    { foodNo: "04", name: "Butter Fried Prawn", serialNo: 4, price: 380 },
    { foodNo: "05", name: "Drums of Haven", serialNo: 5, price: 360 },
    { foodNo: "06", name: "Tempura Vegetable", serialNo: 6, price: 280 },
    { foodNo: "07", name: "Tempura Mixed", serialNo: 7, price: 380 },
    { foodNo: "08", name: "Royal Spring Roll", serialNo: 8, price: 320 },
    { foodNo: "09", name: "Lab Kai (Chicken Salad)", serialNo: 9, price: 425 },
    { foodNo: "10", name: "Mixed Seafood Salad (Yan Talay)", serialNo: 10, price: 450 },
    { foodNo: "11", name: "Cashewnut Salad (Sauç)", serialNo: 11, price: 390 },
    { foodNo: "12", name: "Papaya Salad (Som Tam)", serialNo: 12, price: 325 },
    { foodNo: "13", name: "Tom Yam Soup (Clear)", serialNo: 13, price: 400 },
    { foodNo: "14", name: "Mixed Tom Yam Soup (Cloudy)", serialNo: 14, price: 450 },
    { foodNo: "15", name: "King Prawn Soup (Clear/Cloudy)", serialNo: 15, price: 550 },
];

async function main() {
    const existingCategories = await prisma.foodCategory.count();

    if (existingCategories > 0) {
        console.log("Seed skipped — food categories already exist.");
        return;
    }

    const createdCategories = await Promise.all(
        categories.map((category) =>
            prisma.foodCategory.create({ data: category }),
        ),
    );

    const appetizerCategory = createdCategories[0];

    await prisma.food.createMany({
        data: foods.map((food) => ({
            ...food,
            categoryId: appetizerCategory.id,
            availability: Availability.AVAILABLE,
        })),
    });

    await prisma.property.create({
        data: {
            propertyName: "DineFlow Restaurant",
            city: "Dhaka",
            country: "Bangladesh",
        },
    });

    console.log("Restaurant seed data created successfully.");
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
