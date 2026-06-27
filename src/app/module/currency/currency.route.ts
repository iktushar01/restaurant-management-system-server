import { Router } from "express";
import { SETTINGS_ROLES } from "../../constants/roles";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { CurrencyController } from "./currency.controller";
import {
    createCurrencyZodSchema,
    currencyIdZodSchema,
    listCurrencyQuerySchema,
    updateCurrencyZodSchema,
} from "./currency.validation";

const router = Router();

router.get("/default", checkAuth(...SETTINGS_ROLES), CurrencyController.getDefaultCurrency);
router.get("/all", checkAuth(...SETTINGS_ROLES), CurrencyController.getAllCurrencies);
router.get("/", checkAuth(...SETTINGS_ROLES), validateRequest(listCurrencyQuerySchema, "query"), CurrencyController.listCurrencies);
router.get("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(currencyIdZodSchema, "params"), CurrencyController.getCurrencyById);
router.post("/", checkAuth(...SETTINGS_ROLES), validateRequest(createCurrencyZodSchema), CurrencyController.createCurrency);
router.patch("/:id/set-default", checkAuth(...SETTINGS_ROLES), validateRequest(currencyIdZodSchema, "params"), CurrencyController.setDefaultCurrency);
router.patch("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(currencyIdZodSchema, "params"), validateRequest(updateCurrencyZodSchema), CurrencyController.updateCurrency);
router.delete("/:id", checkAuth(...SETTINGS_ROLES), validateRequest(currencyIdZodSchema, "params"), CurrencyController.deleteCurrency);

export const CurrencyRoute = router;
