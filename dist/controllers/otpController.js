"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const mailController_1 = __importDefault(require("./mailController"));
const node_cron_1 = __importDefault(require("node-cron"));
const verifyOTP_1 = __importDefault(require("../utils/verifyOTP"));
const cronSchedule = process.env.CRON_SCHEDULE || '0 0 * * *';
const generate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { size = 6, type = "numeric", email, organisation = "EMAIL OTP GENERATOR API", subject = "OTP" } = req.body;
        if (!email)
            res.sendStatus(400);
        const validityPeriodMinutes = parseInt(process.env.OTP_VALIDITY_PERIOD_MINUTES || "10"); // Default to 10 minutes if parsing fails
        const now = new Date();
        const validityPeriodMs = validityPeriodMinutes * 60 * 1000;
        const currentTime = new Date(now.getTime() - validityPeriodMs);
        const existingOTP = yield otpModel_1.default.findOne({
            email: email,
        }).lean();
        if (existingOTP) {
            if (existingOTP.attempts >= parseInt(process.env.ATTEMPTS || "3")) { // Max Attempts Reached
                console.log("Too Many Attempts.");
                return res.status(400).send({ "message": "Maximum attempts reached. Please try again after some time" });
            }
            // otp expired            
            if (currentTime >= existingOTP.createdAt) {
                console.log("OTP Expired");
                const otp = (0, generateOTP_1.default)(size, type);
                yield otpModel_1.default.updateOne({ _id: existingOTP._id }, { $inc: { attempts: 1 } }, { otp });
                console.log(existingOTP);
                // send mail
                yield mailController_1.default.sendMail(email, organisation, otp, subject);
                return res.status(200).send({ "email": existingOTP.email, "otp": otp });
            }
            console.log("Resending The Previous OTP");
            yield otpModel_1.default.updateOne({ _id: existingOTP._id }, { $inc: { attempts: 1 } });
            console.log(existingOTP);
            // send mail
            yield mailController_1.default.sendMail(email, organisation, existingOTP.otp, subject);
            return res.status(200).send({ "email": existingOTP.email, "otp": existingOTP.otp });
        }
        if (!existingOTP) {
            console.log("New OTP");
            const otp = (0, generateOTP_1.default)(size, type);
            const otpDocument = yield otpModel_1.default.create({
                otp,
                email,
            });
            // send mail 
            // const intervalId = setInterval(async ()=>{
            //     subject = subject + ".";
            // }, 5000);
            yield mailController_1.default.sendMail(email, organisation, otp, subject);
            // setTimeout(() => {
            // clearInterval(intervalId); // Stops the interval after 5 seconds
            // console.log('Interval cleared');
            // }, 6000);
            return res.status(200).send({ "email": otpDocument.email, "otp": otpDocument.otp });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ "error": error.message });
    }
});
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.sendStatus(400);
        }
        let result = yield (0, verifyOTP_1.default)(email, otp);
        res.status(200).json({ message: 'OTP is verified' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
const scheduledTask = node_cron_1.default.schedule(cronSchedule, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validityPeriodMinutes = parseInt(process.env.OTP_VALIDITY_PERIOD_MINUTES || "10"); // Default to 10 minutes if parsing fails
        const now = new Date();
        const validityPeriodMs = validityPeriodMinutes * 60 * 1000;
        const cutoffTime = new Date(now.getTime() - validityPeriodMs);
        yield otpModel_1.default.deleteMany({ createdAt: { $lt: cutoffTime } });
    }
    catch (error) {
        throw new Error(error.message || 'Failed to clear expired OTPs');
    }
}));
exports.default = {
    generate,
    verify,
    scheduledTask
};
