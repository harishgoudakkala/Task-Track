const _ = require('lodash')
const bcrypt = require('bcrypt')
const User = require('../Models/userModels.js')
const profile = require('../Models/ProfileModel.js')
// const { validationResult } = require('express-validator')
const { otpGenerator, hashPassword } = require('./helpers/utils.js')
const {
    sendEmailVerfifcationMail,
    sendPasswordChangeRequestMail,
} = require('./helpers/mailController')
const { createEncryptedToken } = require('./helpers/verifyToken')

const submitEmail = async (req, res) => {
    try {
        const { firstName, lastName, email } = req?.body
        const userPresent = await User.findOne({ email: email })
        if (userPresent && userPresent?.is_verified == true) {
            return res.status(409).json({ message: 'User is already Present' })
        }
        const otp = otpGenerator(6)
        let userData
        if (userPresent) {
            userPresent.firstName = firstName
            userPresent.lastName = lastName
            userPresent.email = email
            userPresent.otp = otp
            userData = await userPresent.save()
        } else {
            userData = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                otp: otp,
                profiles: [{ title: 'Personal', avatar: '' }]
            })
            userData = await userData.save()
        }
        const userId = userData._id.toString()
        const token = createEncryptedToken(res, { userId })
        await sendEmailVerfifcationMail(firstName, lastName, email, otp)
        return res
            .status(200)
            .json({ token, message: 'Email sent successfully' })
    } catch (error) {
        console.log(`SUBMIT EMAIL`, `Error occurred in creating user: ${error}`)
        return res.status(500).send('Internal Server Error')
    }
}


const submitOTP = async (req, res) => {
    let userId;
    try {
        userId = req?.userId;
        const user = await User.findById(userId);
        const savedOTP = user?.otp;
        const otp = req?.body?.otp;
        if (Number(otp) === Number(savedOTP)) {
            return res.status(200).json({ message: 'OTP is Correct' });
        } else {
            return res.status(401).json({ message: 'OTP is Incorrect' });
        }
    } catch (error) {
        console.log(`SUBMIT OTP`, `Error occurred in otp verification for user with userId: ${userId}: ${error}`);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const submitPassword = async (req, res) => {
    let userId;
    try {
        userId = req.userId;
        const user = await User.findById(userId);
        const password = req?.body?.password;
        const response = await hashPassword(password);
        user.password = response?.password;
        user.salt = response?.salt;
        user.is_verified = true;

        const profilen = new profile({
            userId: userId,
            name: req.body.name || 'Default', 
        });

        await profilen.save();
        await user.save();
        return res.status(200).json({ message: 'Password Set Successfully' });
    } catch (error) {
        console.log(`SUBMIT PASSWORD`, `Error occurred in setting password verification for user with userId: ${userId}: ${error}`);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const submitEmailForPasswordReset = async (req, res) => {
    try {
        const email = req.body.email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }
        const user = await User.findOne({ email })
        if (user) {
            const userId = user._id.toString()
            const otp = otpGenerator(6)

            await sendPasswordChangeRequestMail(
                user.firstName,
                user.lastName,
                email,
                otp
            )

            user.otp = otp
            await user.save()

            const payload = { userId }
            // console.log('Payload for createEncryptedToken:', payload
            const token = createEncryptedToken(res, payload)

            return res
                .status(200)
                .json({ token, message: 'OTP generated successfully' })
        } else {
            return res.status(404).json({ message: 'User does not exist' })
        }
    } catch (error) {
        console.error(
            'SUBMIT PASSWORD RESET EMAIL',
            `Error occurred in processing request: ${error.message}`
        )
        return res.status(500).send('Internal Server Error')
    }
}

const submitChangePassword = async (req, res) => {
    let userId
    try {
        userId = req.userId
        const user = await User.findById(userId)
        const newPassword = req.body?.newPassword
        const oldPassword = req.body?.oldPassword
        const pepper = process?.env?.PEPPER
        const combinedPassword = pepper + oldPassword + user?.salt
        const passMatch = await bcrypt.compare(combinedPassword, user?.password)
        if (!passMatch) {
            res.status(403).json({ message: 'Old password is not correct' })
        } else {
            const response = await hashPassword(newPassword)
            user.password = response?.password
            user.salt = response?.salt
            await user.save()
            return res
                .status(200)
                .json({ message: 'Password changed Succesfully' })
        }
    } catch (error) {
        console.log(
            `SUBMIT CHANGE PASSWORD`,
            `Error occurred in changing password for user with userId: ${userId}: ${error}`
        )
        return res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    submitEmail,
    submitOTP,
    submitPassword,
    submitEmailForPasswordReset,
    submitChangePassword,
}
