import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
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

router.get("/", checkAuth(...ALL_ROLES), validateRequest(listWorkPeriodQuerySchema, "query"), WorkPeriodController.listWorkPeriods);
router.get("/active", checkAuth(...ALL_ROLES), WorkPeriodController.getActiveWorkPeriod);
router.get("/:id", checkAuth(...ALL_ROLES), validateRequest(workPeriodIdZodSchema, "params"), WorkPeriodController.getWorkPeriodById);
router.post("/open", checkAuth(...ALL_ROLES), validateRequest(createWorkPeriodZodSchema), WorkPeriodController.openWorkPeriod);
router.patch("/:id/close", checkAuth(...ALL_ROLES), validateRequest(workPeriodIdZodSchema, "params"), validateRequest(closeWorkPeriodZodSchema), WorkPeriodController.closeWorkPeriod);

export const WorkPeriodRoute = router;
