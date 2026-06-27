import { Router } from "express";
import { EVENT_ROLES, INVENTORY_ROLES, INVENTORY_SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import * as C from "./inventory.controller";
import {
    createBrandSchema,
    createCategorySchema,
    createEventSchema,
    createInventoryItemSchema,
    createPurchaseSchema,
    createVendorPaymentSchema,
    createStockLocationSchema,
    createSubCategorySchema,
    createUnitSchema,
    createVendorSchema,
    idParamSchema,
    listEventsQuerySchema,
    listQuerySchema,
    listSubCategoriesQuerySchema,
    listStockQuerySchema,
    moveStockSchema,
    stockInSchema,
    stockOutSchema,
    updateEventSchema,
} from "./inventory.validation";

const router = Router();
const settingsAuth = checkAuth(...INVENTORY_SETTINGS_ROLES);
const inventoryAuth = checkAuth(...INVENTORY_ROLES);
const eventAuth = checkAuth(...EVENT_ROLES);
const v = (schema: Parameters<typeof validateRequest>[0], src: "body" | "query" | "params" = "body") =>
    validateRequest(schema, src);

// Inventory Categories
router.get("/categories", settingsAuth, v(listQuerySchema, "query"), C.listCategories);
router.post("/categories", settingsAuth, v(createCategorySchema), C.createCategory);
router.get("/categories/:id", settingsAuth, v(idParamSchema, "params"), C.getCategoryById);
router.patch("/categories/:id", settingsAuth, v(idParamSchema, "params"), v(createCategorySchema.partial()), C.updateCategory);
router.delete("/categories/:id", settingsAuth, v(idParamSchema, "params"), C.deleteCategory);

// Sub Categories
router.get("/sub-categories", settingsAuth, v(listSubCategoriesQuerySchema, "query"), C.listSubCategories);
router.post("/sub-categories", settingsAuth, v(createSubCategorySchema), C.createSubCategory);
router.get("/sub-categories/:id", settingsAuth, v(idParamSchema, "params"), C.getSubCategoryById);
router.patch("/sub-categories/:id", settingsAuth, v(idParamSchema, "params"), v(createSubCategorySchema.partial()), C.updateSubCategory);
router.delete("/sub-categories/:id", settingsAuth, v(idParamSchema, "params"), C.deleteSubCategory);

// Brands
router.get("/brands", settingsAuth, v(listQuerySchema, "query"), C.listBrands);
router.post("/brands", settingsAuth, v(createBrandSchema), C.createBrand);
router.get("/brands/:id", settingsAuth, v(idParamSchema, "params"), C.getBrandById);
router.patch("/brands/:id", settingsAuth, v(idParamSchema, "params"), v(createBrandSchema.partial()), C.updateBrand);
router.delete("/brands/:id", settingsAuth, v(idParamSchema, "params"), C.deleteBrand);

// Units
router.get("/units", settingsAuth, v(listQuerySchema, "query"), C.listUnits);
router.post("/units", settingsAuth, v(createUnitSchema), C.createUnit);
router.get("/units/:id", settingsAuth, v(idParamSchema, "params"), C.getUnitById);
router.patch("/units/:id", settingsAuth, v(idParamSchema, "params"), v(createUnitSchema.partial()), C.updateUnit);
router.delete("/units/:id", settingsAuth, v(idParamSchema, "params"), C.deleteUnit);

// Vendors
router.get("/vendors/due-purchases", inventoryAuth, C.getVendorsWithDuePurchases);
router.get("/vendors", inventoryAuth, v(listQuerySchema, "query"), C.listVendors);
router.post("/vendors", settingsAuth, v(createVendorSchema), C.createVendor);
router.get("/vendors/:id", inventoryAuth, v(idParamSchema, "params"), C.getVendorById);
router.patch("/vendors/:id", settingsAuth, v(idParamSchema, "params"), v(createVendorSchema.partial()), C.updateVendor);
router.delete("/vendors/:id", settingsAuth, v(idParamSchema, "params"), C.deleteVendor);

// Stock Locations
router.get("/stock-locations", inventoryAuth, v(listQuerySchema, "query"), C.listStockLocations);
router.post("/stock-locations", settingsAuth, v(createStockLocationSchema), C.createStockLocation);
router.get("/stock-locations/:id", inventoryAuth, v(idParamSchema, "params"), C.getStockLocationById);
router.patch("/stock-locations/:id", settingsAuth, v(idParamSchema, "params"), v(createStockLocationSchema.partial()), C.updateStockLocation);
router.delete("/stock-locations/:id", settingsAuth, v(idParamSchema, "params"), C.deleteStockLocation);

// Inventory Items
router.get("/items", inventoryAuth, v(listQuerySchema, "query"), C.listItems);
router.get("/items/all", inventoryAuth, C.getAllItems);
router.post("/items", settingsAuth, v(createInventoryItemSchema), C.createItem);
router.get("/items/:id", inventoryAuth, v(idParamSchema, "params"), C.getItemById);
router.patch("/items/:id", settingsAuth, v(idParamSchema, "params"), v(createInventoryItemSchema.partial()), C.updateItem);
router.delete("/items/:id", settingsAuth, v(idParamSchema, "params"), C.deleteItem);

// Stock operations
router.get("/stock", inventoryAuth, v(listStockQuerySchema, "query"), C.listStockByLocation);
router.post("/stock/in", inventoryAuth, v(stockInSchema), C.stockIn);
router.post("/stock/out", inventoryAuth, v(stockOutSchema), C.stockOut);
router.post("/stock/move", inventoryAuth, v(moveStockSchema), C.moveStock);

// Purchases
router.get("/purchases", inventoryAuth, v(listQuerySchema, "query"), C.listPurchases);
router.post("/purchases", inventoryAuth, v(createPurchaseSchema), C.createPurchase);

// Vendor Payments
router.get("/vendor-payments", inventoryAuth, v(listQuerySchema, "query"), C.listVendorPayments);
router.post("/vendor-payments", inventoryAuth, v(createVendorPaymentSchema), C.createVendorPayment);

// Events
router.get("/events", eventAuth, v(listEventsQuerySchema, "query"), C.listEvents);
router.get("/events/today", eventAuth, C.getTodayEvents);
router.get("/events/:id", eventAuth, v(idParamSchema, "params"), C.getEventById);
router.post("/events", eventAuth, v(createEventSchema), C.createEvent);
router.patch("/events/:id", eventAuth, v(idParamSchema, "params"), v(updateEventSchema), C.updateEvent);
router.delete("/events/:id", eventAuth, v(idParamSchema, "params"), C.deleteEvent);

export const InventoryRoute = router;
