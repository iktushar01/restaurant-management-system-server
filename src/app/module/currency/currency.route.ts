import { Router } from "express";
import { ALL_ROLES } from "../../constants/roles";
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

router.get("/default", checkAuth(...ALL_ROLES), CurrencyController.getDefaultCurrency);
router.get("/all", checkAuth(...ALL_ROLES), CurrencyController.getAllCurrencies);
router.get("/", checkAuth(...ALL_ROLES), validateRequest(listCurrencyQuerySchema, "query"), CurrencyController.listCurrencies);
router.get("/:id", checkAuth(...ALL_ROLES), validateRequest(currencyIdZodSchema, "params"), CurrencyController.getCurrencyById);
router.post("/", checkAuth(...ALL_ROLES), validateRequest(createCurrencyZodSchema), CurrencyController.createCurrency);
router.patch("/:id/set-default", checkAuth(...ALL_ROLES), validateRequest(currencyIdZodSchema, "params"), CurrencyController.setDefaultCurrency);
router.patch("/:id", checkAuth(...ALL_ROLES), validateRequest(currencyIdZodSchema, "params"), validateRequest(updateCurrencyZodSchema), CurrencyController.updateCurrency);
router.delete("/:id", checkAuth(...ALL_ROLES), validateRequest(currencyIdZodSchema, "params"), CurrencyController.deleteCurrency);

export const CurrencyRoute = router;
