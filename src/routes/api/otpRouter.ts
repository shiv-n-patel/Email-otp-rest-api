import { Router } from "express";
import otpController from "../../controllers/otpController";

const otpRouter = Router();

otpRouter.post('/api/generate',otpController.generate);
otpRouter.post('/api/verify',otpController.verify);

export default otpRouter;