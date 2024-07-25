import nodemailer from "nodemailer";

const sendMail = async (email: string, organisation: string, otp: string | number, subject: string) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    organisation = "Aashkajani_ on instagram"

    const mailOptions = {
        from: `${organisation} <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Aashkajani_ sent you a message`,
        // text: `Aashkajani sent you a message: Hiii`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Message Notification</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background-color: #fafafa;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .header img {
                        width: 100px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .message-preview {
                        background-color: #f0f0f0;
                        padding: 15px;
                        border-radius: 5px;
                        font-size: 1.2em;
                        margin-bottom: 20px;
                    }
                    .footer {
                        text-align: center;
                        color: #999;
                        padding: 20px;
                        border-top: 1px solid #e0e0e0;
                    }
                    .footer a {
                        color: #3897f0;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram">
                    </div>
                    <div class="content">
                        <p><strong>Aashkajani_</strong> sent you a message:</p>
                        
                        <p><a href="https://www.instagram.com" style="color: #3897f0; text-decoration: none;">View Message</a></p>
                    </div>
                    <div class="footer">
                        <p>This message was sent to <strong>Vraj Shah</strong></p>
                        <p><a href="https://www.instagram.com" style="color: #3897f0;">Unsubscribe</a> | <a href="https://www.instagram.com" style="color: #3897f0;">Help Center</a></p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    const res = await transporter.sendMail(mailOptions);
    console.log(res);
}

export default {
    sendMail,
}
