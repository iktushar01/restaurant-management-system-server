import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
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

router.get("/", checkAuth(...ALL_ROLES), validateRequest(listDineTableQuerySchema, "query"), DineTableController.listDineTables);
router.get("/all", checkAuth(...ALL_ROLES), DineTableController.getAllDineTables);
router.get("/:id", checkAuth(...ALL_ROLES), validateRequest(dineTableIdZodSchema, "params"), DineTableController.getDineTableById);
router.post("/", checkAuth(...ALL_ROLES), validateRequest(createDineTableZodSchema), DineTableController.createDineTable);
router.patch("/:id", checkAuth(...ALL_ROLES), validateRequest(dineTableIdZodSchema, "params"), validateRequest(updateDineTableZodSchema), DineTableController.updateDineTable);
router.patch("/:id/status", checkAuth(...ALL_ROLES), validateRequest(dineTableIdZodSchema, "params"), validateRequest(updateDineTableStatusZodSchema), DineTableController.updateDineTableStatus);
router.delete("/:id", checkAuth(...ALL_ROLES), validateRequest(dineTableIdZodSchema, "params"), DineTableController.deleteDineTable);

export const DineTableRoute = router;
