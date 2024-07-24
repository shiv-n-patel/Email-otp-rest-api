import { Router } from "express";
import rootRouter from "./rootRouter";
import otpRouter from "./api/otpRouter";

const mainRouter = Router();

mainRouter.use(rootRouter);
mainRouter.use(otpRouter);

export default mainRouter;
