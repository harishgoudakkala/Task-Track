const crypto = require('crypto')
const bcrypt = require('bcrypt')

const otpGenerator = (length) => {
    const chars = '123456789'
    let otp = ''
    for (let i = 0; i < length; i++) {
        otp += chars[Math.floor(Math.random() * chars.length)]
    }
    return otp
}

const hashPassword = async (password) => {
    try {
        const salt = await new Promise((resolve, reject) => {
            crypto.randomBytes(8, (err, buf) => {
                if (err) reject(err)
                resolve(buf.toString('hex'))
            })
        })
        // console.log("SALT GENERATED IS : " + salt);
        const pepper = process.env.PEPPER
        const combinedPassword = pepper + password + salt
        securePass = await bcrypt.hash(combinedPassword, 9)
        return { password: securePass, salt }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    otpGenerator,
    hashPassword,
}