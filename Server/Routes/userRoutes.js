const express = require('express');
const user_route = express()
const bodyParser = require('body-parser')
user_route.use(bodyParser.urlencoded({ extended: false }))
user_route.use(bodyParser.json())
const loginController = require('../Controllers/loginController')
const signupController = require('../Controllers/signupController')
const {verifyTokenMiddleware} = require('../Controllers/helpers/verifyToken')
const passport = require('passport')

user_route.post(
    '/login',
    // // userRoutesValidation.loginValidation,
    // validate(userRoutesValidation.loginSchema),
    loginController.verifyLogin
)
user_route.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
)
user_route.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    loginController.googleAuthLogin
)

//SignUp API's
user_route.post(
    '/signup/email-form',
    // // userRoutesValidation.emailFormValidation,
    // validate(userRoutesValidation.emailFormSchema),
    signupController.submitEmail
)
user_route.post(
    '/signup/verify-email-otp',
    verifyTokenMiddleware,
    signupController.submitOTP
)
user_route.post(
    '/signup/password',
    verifyTokenMiddleware,
    // // userRoutesValidation.paaswordValidation,
    // validateField(userRoutesValidation.passwordSchema, 'password'),
    signupController.submitPassword
)

//ForgotPassword API's
user_route.post(
    '/forgot-password',
    // // userRoutesValidation.emailValidation,
    // validateField(userRoutesValidation.emailSchema, 'email'),
    signupController.submitEmailForPasswordReset
)
user_route.post(
    '/forgot-password/verify-otp',
    verifyTokenMiddleware,
    // // userRoutesValidation.otpValidation,
    // validate(userRoutesValidation.otpValidationSchema),
    signupController.submitOTP
)
user_route.post(
    '/forgot-password/set-password',
    verifyTokenMiddleware,
    // // userRoutesValidation.paaswordValidation,
    // validateField(userRoutesValidation.passwordSchema, 'password'),
    signupController.submitPassword
)


module.exports = user_route;