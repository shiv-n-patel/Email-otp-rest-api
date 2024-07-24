import rootController from "../controllers/rootController";
import { Router } from "express";

const rootRouter = Router();

rootRouter.get("^/$|/index(.html)?",rootController.home);
rootRouter.get("/index(.html)?/data",rootController.data);

export default rootRouter;