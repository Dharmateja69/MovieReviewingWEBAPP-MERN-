const nodemailer = require('nodemailer');

// Function to generate OTP
exports.generateotp = (otp_length = 6) => {
    let OTP = "";
    for (let i = 1; i <= otp_length; i++) {
        const randomvalue = Math.round(Math.random() * 9);
        OTP += randomvalue;
    }
    return OTP;
};

// Function to create transport for sending OTP via email
exports.generateEmailotp= () => {
    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "b0a9a6b4f8ad87",
            pass: "55c60297b2a346"
        }
    });
return transporter;
    // You can use the transporter to send an email, e.g.
    // const mailOptions = {
    //     from: 'your-email@example.com',
    //     to: 'recipient@example.com',
    //     subject: 'Your OTP Code',
    //     text: 'Your OTP is: ' + otp
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
};
