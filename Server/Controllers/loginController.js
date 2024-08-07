const _ = require('lodash');
const User = require('../Models/UserModels');
const bcrypt = require('bcrypt');
const { createEncryptedToken } = require('./helpers/verifyToken');
// const { validationResult } = require('express-validator')
// const { auditLog } = require('../config/audit')

const verifyLogin = async (req, res) => {
    try {
        const email = _.toLower(req.body.email.trim());
        const pass = req.body.password?.trim();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ userExist: 0, message: 'User does not exist' });
        }

        if (user.is_verified === 0) {
            return res.status(401).json({ is_verified: 0, message: 'User is not verified, please sign up again' });
        }

        const pepper = process.env.PEPPER;
        const combinedPassword = pepper + pass + user.salt;
        const passMatch = await bcrypt.compare(combinedPassword, user.password);

        if (passMatch) {
            const token = createEncryptedToken(res, { userId: user._id.toString() });
            return res.status(200).json({ userExist: 1, passwordMatch: 1, stage: user.stage, message: 'Login Successful', token });
        } else {
            return res.status(401).json({ is_verified: 1, passwordMatch: 0, message: 'Incorrect password' });
        }
    } catch (error) {
        console.error(`Error occurred during login: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
};

const googleAuthLogin = async (req, res) => {
    try {
        const email = req.user?.emails?.[0]?.value;
        const firstName = req.user?.name?.givenName;
        const lastName = req.user?.name?.familyName;

        let user = await User.findOne({ email });
        let redirectUrl;

        if (user) {
            if (user.is_verified) {
                const token = createEncryptedToken(res, { userId: user._id.toString() });
                redirectUrl = `http://localhost:3000/authResponse?userExist=1&token=${token}`;
            } else {
                return res.redirect(`http://localhost:3000/authResponse?userExist=0`);
            }
        } else {
            user = new User({
                firstName,
                lastName,
                email,
                is_verified: false
            });
            await user.save();

            const token = createEncryptedToken(res, { userId: user._id.toString() });
            redirectUrl = `http://localhost:3000/authResponse?userExist=0&token=${token}`;
        }

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error(`Error occurred during Google login: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    verifyLogin,
    googleAuthLogin,
};
