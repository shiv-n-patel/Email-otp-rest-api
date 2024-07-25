import mongoose from "mongoose";
import Otp from "../models/otpModel";

const validityPeriodMinutes: number = parseInt(process.env.OTP_VALIDITY_PERIOD_MINUTES || "10"); // Default to 10 minutes if parsing fails
const now = new Date();
const validityPeriodMs = validityPeriodMinutes * 60 * 1000;
const currentTime = new Date(now.getTime() - validityPeriodMs);

const verifyOTP = async (email : string, otp : string) => {

    const otpDocument = await Otp.findOneAndDelete({
        email: email,
        otp: otp,
    }).lean();


    if (!otpDocument) {
        console.log('Invalid OTP');
        throw new Error('Invalid OTP');
    }
    else if (currentTime > otpDocument.createdAt){
        console.log("Otp Expired");
        throw new Error('OTP Expired');
    }

    return true;
}

export default verifyOTP;