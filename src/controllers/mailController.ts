import nodemailer from "nodemailer";

const sendMail = async (email: string, organisation: string, otp: string, subject: string) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${organisation}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `${subject}`,
        text: `Your OTP is ${otp}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <title>${organisation} One-Time Password (OTP)</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: rgb(221, 219, 219);
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }

                    .mail-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        width: 90%;
                        max-width: 600px;
                        padding: 2em;
                        border: none;
                        border-radius: 1em;
                        background-color: rgb(233, 233, 233);
                        box-shadow: 0.5em 0.5em 0.8em rgba(185, 198, 255, 0.583), -0.5em -0.5em 0.8em rgba(185, 198, 255, 0.583);
                        text-align: center;
                    }

                    .mail-container h1 {
                        margin: 0;
                        font-size: 2em;
                        color: rgb(100, 100, 255);
                    }

                    .mail-container p {
                        margin: 1em 0;
                        color: rgb(100, 100, 100);
                    }

                    .otp-code {
                        font-size: 2.5em;
                        letter-spacing: 0.2em;
                        color: rgb(50, 50, 150);
                        margin: 1em 0;
                    }

                    .footer p {
                        margin: 0.5em 0;
                        color: rgb(172, 172, 172);
                    }

                    .footer a {
                        color: rgb(100, 100, 255);
                        text-decoration: none;
                    }

                    .footer a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="mail-container">
                    <div>
                        <h1>Email OTP API</h1>
                        <p>Let's verify you first.</p>
                    </div>

                    <p>Use this code to change your password:</p>
                    <div class="otp-code">${otp}</div>

                    <div class="footer">
                        <p>If you didn't request this email, ignore it.</p>
                        <p>This API is built by <a href="https://github.com/shivam-n-patel">shivam-n-patel</a></p>
                    </div>
                </div>
            </body>
            </html>

        
        `
    };

    const res = await transporter.sendMail(mailOptions);
    console.log(res);

}

export default {
    sendMail,
}