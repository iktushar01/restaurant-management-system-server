import { Router } from "express";
import { REFERENCE_READ_ROLES, SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { WorkPeriodController } from "./workPeriod.controller";
import {
    closeWorkPeriodZodSchema,
    createWorkPeriodZodSchema,
    listWorkPeriodQuerySchema,
    workPeriodIdZodSchema,
} from "./workPeriod.validation";

const router = Router();

router.get("/", checkAuth(...SETTINGS_ROLES), validateRequest(listWorkPeriodQuerySchema, "query"), WorkPeriodController.listWorkPeriods);
router.get("/active", checkAuth(...REFERENCE_READ_ROLES), WorkPeriodController.getActiveWorkPeriod);
router.get("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(workPeriodIdZodSchema, "params"), WorkPeriodController.getWorkPeriodById);
router.post("/open", checkAuth(...SETTINGS_ROLES), validateRequest(createWorkPeriodZodSchema), WorkPeriodController.openWorkPeriod);
router.patch("/:id/close", checkAuth(...SETTINGS_ROLES), validateRequest(workPeriodIdZodSchema, "params"), validateRequest(closeWorkPeriodZodSchema), WorkPeriodController.closeWorkPeriod);

export const WorkPeriodRoute = router;
