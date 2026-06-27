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

export const ORDER_ROLES = ALL_ROLES;

export const EVENT_ROLES = [
    Role.WAITER,
    Role.MANAGER,
    Role.ADMIN,
    Role.SUPER_ADMIN,
] as const;

export const INVENTORY_ROLES = [
    Role.STAFF,
    Role.MANAGER,
    Role.ADMIN,
    Role.SUPER_ADMIN,
] as const;

export const INVENTORY_SETTINGS_ROLES = MANAGEMENT_ROLES;

export const FINANCE_ROLES = [
    Role.CASHIER,
    Role.MANAGER,
    Role.ADMIN,
    Role.SUPER_ADMIN,
] as const;

export const HR_ROLES = MANAGEMENT_ROLES;

export const BANK_ROLES = MANAGEMENT_ROLES;

export const REPORT_ROLES = [
    Role.CASHIER,
    ...MANAGEMENT_ROLES,
] as const;

export const SETTINGS_ROLES = [
    Role.ADMIN,
    Role.SUPER_ADMIN,
] as const;
