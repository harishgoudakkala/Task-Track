const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const crypto = require('crypto');
const secretKey = process.env.secretKey;
const encryptionSecret = process.env.encryptionSecret;
const User = require("../../Models/UserModels.js");

function encrypt(text) {
    // AES 256 GCM Mode
    if (typeof secretKey !== 'string') {
        throw new Error('Secret key must be a string.')
    }
    const keyBuffer = Buffer.from(secretKey, 'hex')
    if (keyBuffer.length !== 32) {
        throw new Error('Secret key must be a 32-byte (256-bit) hex string.')
    }
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return (
        iv.toString('hex') +
        ':' +
        encrypted +
        ':' +
        cipher.getAuthTag().toString('hex')
    )
}

function decrypt(text) {
    // console.log("Toekn to decrypt is : " + text);
    if (typeof secretKey !== 'string') {
        throw new Error('Secret key must be a string.')
    }
    const keyBuffer = Buffer.from(secretKey, 'hex')
    if (keyBuffer.length !== 32) {
        throw new Error('Secret key must be a 32-byte (256-bit) hex string.')
    }
    let parts = text.split(':')
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format.')
    }
    const iv = Buffer.from(parts[0], 'hex')
    const encryptedText = Buffer.from(parts[1], 'hex')
    const authTag = Buffer.from(parts[2], 'hex')
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encryptedText)
    decrypted += decipher.final('utf8')
    // console.log("Decypted data is : " + decrypted);
    return decrypted
}

function createEncryptedToken(res, data) {
    if (typeof data !== 'object' || Array.isArray(data) || data === null) {
        throw new Error('Payload must be a plain object')
    }

    const token = jwt.sign(data, secretKey, { expiresIn: '30m' });
    const encryptedToken = encrypt(token);

    res.cookie('token', encryptedToken, {
        maxAge: 1800000, // 30 minutes
        path: '/', // Make sure the path is correctly specified
        // domain: '.localhost', // Adjust if you have a specific domain
        secure: true, // Set to true if serving over HTTPS
        // sameSite: 'Lax', // Adjust based on your configuration
        httpOnly: false // Set to true if you want the cookie to be inaccessible to JavaScript
      });

    return encryptedToken
}


const validToken = async (req, res, next) => {
    let flag = 0;
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(498).json({ message: 'No token provided', tokenVerified: 0 });
    }

    let token;
    try {
        const encryptedToken = bearerToken.split(' ')[1];
        token = decrypt(encryptedToken);
    } catch( error ){
        return res.status(498).json({ message: 'Failed to authenticate token', tokenVerified: 0 });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            flag = 1;
            return;
        }
        req.userId = decoded.userId;
    });
    if (flag == 0 && !mongoose.Types.ObjectId.isValid(req.userId)) {
        req.userId = null;
        flag = 1;
    }
    if (flag == 1) {
        return res.status(498).json({ message: 'Failed to authenticate token', tokenVerified: 0 });
    }
    next();
};



const verifyTokenMiddleware = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return res.status(498).json({ message: 'No token provided', tokenVerified: 0 });
        }

        const encryptedToken = bearerToken.split(' ')[1];
        let token;
        try {
            token = decrypt(encryptedToken);
        } catch (error) {
            return res.status(498).json({ message: 'Failed to authenticate token', tokenVerified: 0 });
        }

        // Using Promises with jwt.verify
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(498).json({ message: 'Failed to authenticate token', tokenVerified: 0 });
            }
            
            req.userId = decoded.userId;

            // Check if the userId is valid
            if (!mongoose.Types.ObjectId.isValid(req.userId)) {
                return res.status(498).json({ message: 'Invalid user ID', tokenVerified: 0 });
            }

            try {
                const user = await User.findOne({ _id: req.userId });
                if (user) {
                    if (user.is_admin) {
                        return res.status(403).json({ message: 'Don\'t have permission for the requested action' });
                    } else {
                        next();
                    }
                } else {
                    return res.status(404).json({ userExist: 0, message: 'User does not exist' });
                }
            } catch (error) {
                console.log(`VerifyTokenMiddleware`, `Error occurred in verifyTokenMiddleware: ${error}`);
                return res.status(500).send('Internal Server Error');
            }
        });
    } catch (error) {
        console.log(`VerifyTokenMiddleware`, `Error occurred in verifyTokenMiddleware: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    verifyTokenMiddleware,
    validToken,
    createEncryptedToken,
    decrypt,
}