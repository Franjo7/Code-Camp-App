import nodeMailer from 'nodemailer';

//const nodemailer =  require('nodemailer');


const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD  
            },
        });


export const sendEmail = async (to,subject,text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: to,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Error in sending email: ${error}`);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(`Email sent: ${info.response}`);
                return res.status(200).json({ message: 'Email has been sent' });
            }
        });

    }catch (error) {
        console.error(`Error in sendEmail function: ${error}`);
    }
};