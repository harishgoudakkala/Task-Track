const nodemailer = require('nodemailer');

// Create a transport object using your email service configuration
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or an application-specific password
    }
});

// Function to send email verification mail
const sendEmailVerfifcationMail = async (firstName, lastName, email, otp) => {
    const mailOptions = {
        from: `Task Track <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification',
        html: `
            <h1>Hello ${firstName} ${lastName},</h1>
            <p>Thank you for registering with us.</p>
            <p>Your OTP for verification is: <strong>${otp}</strong></p>
            <p>Please use this OTP to verify your email address.</p>
            <p>Regards,<br>Task Track</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email verification mail sent successfully');
    } catch (error) {
        console.error('Error sending email verification mail:', error);
        throw new Error('Failed to send email verification mail');
    }
};

// Function to send password change request mail
const sendPasswordChangeRequestMail = async (firstName, lastName, email, otp) => {
    const mailOptions = {
        from: `Task Track <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Change Request',
        html: `
            <h1>Hello ${firstName} ${lastName},</h1>
            <p>We received a request to change your password.</p>
            <p>Your OTP for password change is: <strong>${otp}</strong></p>
            <p>Please use this OTP to reset your password.</p>
            <p>If you did not request a password change, please ignore this email.</p>
            <p>Regards,<br>Task Track</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password change request mail sent successfully');
    } catch (error) {
        console.error('Error sending password change request mail:', error);
        throw new Error('Failed to send password change request mail');
    }
};

module.exports = {
    sendEmailVerfifcationMail,
    sendPasswordChangeRequestMail,
};