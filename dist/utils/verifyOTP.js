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
const otpModel_1 = __importDefault(require("../models/otpModel"));
const validityPeriodMinutes = parseInt(process.env.OTP_VALIDITY_PERIOD_MINUTES || "10"); // Default to 10 minutes if parsing fails
const now = new Date();
const validityPeriodMs = validityPeriodMinutes * 60 * 1000;
const currentTime = new Date(now.getTime() - validityPeriodMs);
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const otpDocument = yield otpModel_1.default.findOneAndDelete({
        email: email,
        otp: otp,
    }).lean();
    if (!otpDocument) {
        console.log('Invalid OTP');
        throw new Error('Invalid OTP');
    }
    else if (currentTime > otpDocument.createdAt) {
        console.log("Otp Expired");
        throw new Error('OTP Expired');
    }
    return true;
});
exports.default = verifyOTP;
