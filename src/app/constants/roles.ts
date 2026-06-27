import { Role } from "../lib/prisma-exports";

export const ALL_ROLES = [
    Role.STAFF,
    Role.WAITER,
    Role.MANAGER,
    Role.CASHIER,
    Role.ADMIN,
    Role.SUPER_ADMIN,
] as const;

export const MANAGEMENT_ROLES = [
    Role.MANAGER,
    Role.ADMIN,
    Role.SUPER_ADMIN,
] as const;
