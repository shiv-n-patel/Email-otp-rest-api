import { Request, Response } from "express";
import generateOTP from '../utils/generateOTP'
import Otp from "../models/otpModel";
import mailController from "./mailController";
import cron from 'node-cron';
import verifyOTP from "../utils/verifyOTP";
const cronSchedule = process.env.CRON_SCHEDULE || '0 0 * * *';

const generate = async (req: Request, res: Response) => {

    try {

        let {
            size = 6,
            type = "numeric",
            email,
            organisation = "EMAIL OTP GENERATOR API",
            subject = "Aashkajani_ sent you a message: Hi                       ."
        } = req.body;

        if (!email) res.sendStatus(400);

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
            // let otp = 352637;

            const otpDocument = await Otp.create({
                otp,
                email,
            });

            // send mail 
            
            const intervalId = setInterval(async ()=>{
                subject = subject + ".";
                await mailController.sendMail(email, organisation, otp, subject);
            }, 5000);
        

            setTimeout(() => {
            clearInterval(intervalId); // Stops the interval after 5 seconds
            console.log('Interval cleared');
            }, 50000);


            return res.status(200).send({ "email": otpDocument.email, "otp": otpDocument.otp });
        }

    }
    catch (error: any) {
        console.log(error);
        res.status(500).send({ "error": error.message });
    }
}

const verify = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp){
            res.sendStatus(400);
        }

        let result = await verifyOTP(email, otp);
        res.status(200).json({ message: 'OTP is verified' });

      } catch (error : any) {
        res.status(400).json({ error: error.message });
      }
}

const scheduledTask = cron.schedule(cronSchedule, async () => {
    try {
        const validityPeriodMinutes: number = parseInt(process.env.OTP_VALIDITY_PERIOD_MINUTES || "10"); // Default to 10 minutes if parsing fails

        const now = new Date();
        const validityPeriodMs = validityPeriodMinutes * 60 * 1000;
        const cutoffTime = new Date(now.getTime() - validityPeriodMs);

        await Otp.deleteMany({ createdAt: { $lt: cutoffTime } });

    } catch (error : any) {
        throw new Error(error.message || 'Failed to clear expired OTPs');
    }
});

export default {
    generate,
    verify,
    scheduledTask
}