import { Router } from "express";
import { ORDER_ROLES, REFERENCE_READ_ROLES, SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { DineTableController } from "./dineTable.controller";
import {
    createDineTableZodSchema,
    dineTableIdZodSchema,
    listDineTableQuerySchema,
    updateDineTableStatusZodSchema,
    updateDineTableZodSchema,
} from "./dineTable.validation";

const router = Router();

router.get("/", checkAuth(...REFERENCE_READ_ROLES), validateRequest(listDineTableQuerySchema, "query"), DineTableController.listDineTables);
router.get("/all", checkAuth(...REFERENCE_READ_ROLES), DineTableController.getAllDineTables);
router.get("/:id", checkAuth(...REFERENCE_READ_ROLES), validateRequest(dineTableIdZodSchema, "params"), DineTableController.getDineTableById);
router.post("/", checkAuth(...SETTINGS_ROLES), validateRequest(createDineTableZodSchema), DineTableController.createDineTable);
router.patch("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineTableIdZodSchema, "params"), validateRequest(updateDineTableZodSchema), DineTableController.updateDineTable);
router.patch("/:id/status", checkAuth(...ORDER_ROLES), validateRequest(dineTableIdZodSchema, "params"), validateRequest(updateDineTableStatusZodSchema), DineTableController.updateDineTableStatus);
router.delete("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(dineTableIdZodSchema, "params"), DineTableController.deleteDineTable);

export const DineTableRoute = router;
