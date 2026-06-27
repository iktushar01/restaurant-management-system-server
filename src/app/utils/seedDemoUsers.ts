import { Role } from "../lib/prisma-exports";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { envVars } from "../../config/env";
import { DEMO_USERS, DemoUserConfig } from "../constants/demoUsers";

const createDemoUser = async (config: DemoUserConfig) => {
    const trimmedEmail = config.email.trim();

    const existing = await prisma.user.findUnique({
        where: { email: trimmedEmail },
    });

    if (existing) {
        console.log(`Demo user already exists: ${trimmedEmail}. Skipping.`);
        return;
    }

    console.log(`Seeding demo user: ${config.label} (${trimmedEmail})`);

    const signUpResult = await auth.api.signUpEmail({
        body: {
            email: trimmedEmail,
            password: config.password,
            name: config.name,
            role: config.role,
            needPasswordChange: false,
            rememberMe: false,
        },
    });

    if (!signUpResult?.user) {
        throw new Error(`Failed to create demo user: ${trimmedEmail}`);
    }

    await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: signUpResult.user.id },
            data: {
                emailVerified: true,
                role: config.role,
            },
        });

        if (config.profile === "admin") {
            await tx.admin.create({
                data: {
                    userId: signUpResult.user.id,
                    name: config.name,
                    email: trimmedEmail,
                },
            });
        } else {
            await tx.normalUser.create({
                data: {
                    userId: signUpResult.user.id,
                    name: config.name,
                    email: trimmedEmail,
                },
            });
        }
    });

    console.log(`Demo user created: ${config.label}`);
};

export const seedDemoUsers = async () => {
    try {
        const usersToSeed: DemoUserConfig[] = DEMO_USERS.map((user) => {
            if (user.role !== Role.SUPER_ADMIN) {
                return user;
            }

            const envEmail = envVars.SUPER_ADMIN_EMAIL?.trim();
            const envPassword = envVars.SUPER_ADMIN_PASSWORD;

            if (envEmail && envPassword) {
                return {
                    ...user,
                    email: envEmail,
                    password: envPassword,
                };
            }

            return user;
        });

        for (const user of usersToSeed) {
            await createDemoUser(user);
        }
    } catch (error) {
        console.error("Error seeding demo users:", error);
    }
};
