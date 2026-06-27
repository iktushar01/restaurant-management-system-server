import { Role } from "../lib/prisma-exports";
import { envVars } from "../../config/env";

export const DEMO_PASSWORD = "Demo@123";

export type DemoUserProfile = "admin" | "normal";

export interface DemoUserConfig {
    role: Role;
    email: string;
    password: string;
    name: string;
    profile: DemoUserProfile;
    label: string;
}

export const DEMO_USERS: DemoUserConfig[] = [
    {
        role: Role.SUPER_ADMIN,
        email: "superadmin@demo.com",
        password: DEMO_PASSWORD,
        name: "Super Admin",
        profile: "admin",
        label: "Super Admin",
    },
    {
        role: Role.ADMIN,
        email: "admin@demo.com",
        password: DEMO_PASSWORD,
        name: "Admin User",
        profile: "admin",
        label: "Admin",
    },
    {
        role: Role.MANAGER,
        email: "manager@demo.com",
        password: DEMO_PASSWORD,
        name: "Manager User",
        profile: "normal",
        label: "Manager",
    },
    {
        role: Role.CASHIER,
        email: "cashier@demo.com",
        password: DEMO_PASSWORD,
        name: "Cashier User",
        profile: "normal",
        label: "Cashier",
    },
    {
        role: Role.WAITER,
        email: "waiter@demo.com",
        password: DEMO_PASSWORD,
        name: "Waiter User",
        profile: "normal",
        label: "Waiter",
    },
    {
        role: Role.STAFF,
        email: "staff@demo.com",
        password: DEMO_PASSWORD,
        name: "Staff User",
        profile: "normal",
        label: "Staff",
    },
];

export const getDemoUsersForClient = (): Pick<DemoUserConfig, "role" | "email" | "password" | "label">[] =>
    DEMO_USERS.map(({ role, email, password, label }) => {
        if (role === Role.SUPER_ADMIN) {
            const envEmail = envVars.SUPER_ADMIN_EMAIL?.trim();
            const envPassword = envVars.SUPER_ADMIN_PASSWORD;

            if (envEmail && envPassword) {
                return { role, email: envEmail, password: envPassword, label };
            }
        }

        return { role, email, password, label };
    });
