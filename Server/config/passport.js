const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth20').Strategy

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL:
                'http://localhost:8000/api/users/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, done) {
            done(null, profile)
        }
    )
)
