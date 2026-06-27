import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { envVars } from "./config/env";
import { IndexRoute } from "./app/routes/index";
import { globalErrorhandler } from "./app/middleware/globalErrorhandler";
import { notFound } from "./app/middleware/notFound";
import { auth } from "./app/lib/auth";
import { templatesDir } from "./app/utils/appPaths";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", templatesDir);

const corsOrigins = [
    ...envVars.FRONTEND_URL.split(",").map((origin) => origin.trim()),
    envVars.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000",
].filter(Boolean);

const corsOptions = {
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("DineFlow Server is running");
});

app.use("/api/v1", IndexRoute);

app.use(globalErrorhandler);
app.use(notFound);

export default app;
