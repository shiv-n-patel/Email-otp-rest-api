"use strict";
const nodemailer = require('nodemailer');

const sendMail = async (email, organisation, otp, subject) => {
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
        text: `Your OTP is ${otp}. If you didn't request this email, ignore it. This API is built by shivam-n-patel.`,
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
                        font-family: Arial, sans-serif;
                        background-color: #f3e6ff;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border: 1px solid #d1c4e9;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        color: #6a1b9a;
                    }
                    .content {
                        color: #4a148c;
                    }
                    .otp {
                        color: #6a1b9a;
                        background-color: #ede7f6;
                        padding: 10px;
                        border-radius: 5px;
                        display: inline-block;
                        font-size: 1.5em;
                    }
                    .footer {
                        color: #9575cd;
                    }
                    a {
                        color: #7b1fa2;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <center>
                        <div>
                            <h1 class="header">Email OTP API</h1>
                            <p class="content">Let's verify you first.</p>
                            <p class="content">Use this code to change your password:</p>
                            <h2 class="otp">${otp}</h2>
                            <p class="footer">If you didn't request this email, ignore it.</p>
                            <p class="footer">This API is built by <a href="https://github.com/shivam-n-patel">shivam-n-patel</a></p>
                        </div>
                    </center>
                </div>
            </body>
            </html>
        `,
    };

    try {
        const res = await transporter.sendMail(mailOptions);
        console.log(res);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendMail };

