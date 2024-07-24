import { Request, Response } from "express";
import generateOTP from '../utils/generateOTP'
import Otp from "../models/otpModel";
import mailController from "./mailController";

const generate = async (req: Request, res: Response) => {

    try {

        const {
            size = 6,
            type = "numeric",
            email,
            organisation = "EMAIL OTP GENERATOR API",
            subject = "One Time Password"
        } = req.body;

        const validityPeriodMinutes: number = parseInt(process.env.OTP_VALIDITY_PERIOD_MINUTES || "10"); // Default to 10 minutes if parsing fails

        const now = new Date();
        const validityPeriodMs = validityPeriodMinutes * 60 * 1000;
        const currentTime = new Date(now.getTime() - validityPeriodMs);


        const existingOTP = await Otp.findOne({
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
                const otp = generateOTP(size, type);
                await Otp.updateOne({ _id: existingOTP._id }, { $inc: { attempts: 1 } }, { otp });
                console.log(existingOTP);

                // send mail
                await mailController.sendMail(email, organisation, otp, subject);
                return res.status(200).send({ "email": existingOTP.email, "otp": otp });
            }

            console.log("Resending The Previous OTP");

            await Otp.updateOne({ _id: existingOTP._id }, { $inc: { attempts: 1 } });
            console.log(existingOTP);
            // send mail
            await mailController.sendMail(email, organisation, existingOTP.otp, subject);
            return res.status(200).send({ "email": existingOTP.email, "otp": existingOTP.otp });
        }





        if (!existingOTP) {
            console.log("New OTP");
            const otp = generateOTP(size, type);

            const otpDocument = await Otp.create({
                otp,
                email,
            });

            // send mail 
            await mailController.sendMail(email, organisation, otp, subject);
            return res.status(200).send({ "email": otpDocument.email, "otp": otpDocument.otp });
        }

    }
    catch (error: any) {
        console.log(error);
        res.status(500).send({ "error": error.message });
    }
}

const verify = (req: Request, res: Response) => {
    res.send("verify");
}

export default {
    generate,
    verify
}