const User = require('../models/User')
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')



module.exports = {
    createUser: async (req, res) => {
        const user = req.body;

        try {
            await admin.auth().getUserByEmail(user.email);

            res.status(400).json({ message: 'Email already registered' })
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const userResponse = await admin.auth().createUser({
                        email: user.email,
                        password: user.password,
                        emailVerified: false,
                        disabled: false,
                    });

                    console.log(userResponse.uid);

                    const newUser = new User({
                        fullname: user.fullname,
                        email: user.email,
                        password: CryptoJS.AES.encrypt(user.password, process.env.SECRET).toString(),
                        uid: userResponse.uid,
                        userType: user.userType || 'Client'
                    })

                    await newUser.save();
                    res.status(201).json({ status: true })
                } catch (error) {
                    console.error("Error saving user to mongoDB", error);
                    res.status(500).json({ status: false, error: "Error creating user" })
                }
            }

        }
    },

    createInfluencer: async (req, res) => {
        const influencer = req.body;

        try {
            await admin.auth().getUserByEmail(influencer.email);

            res.status(400).json({ message: 'Email already registered' })
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const userResponse = await admin.auth().createUser({
                        email: influencer.email,
                        password: influencer.password,
                        emailVerified: false,
                        disabled: false,
                    });

                    console.log(userResponse.uid);

                    const newInfluencer = new User({
                        fullname: influencer.fullname,
                        email: influencer.email,
                        password: CryptoJS.AES.encrypt(influencer.password, process.env.SECRET).toString(),
                        uid: userResponse.uid,
                        userType: 'Influencer'
                    })

                    await newInfluencer.save();
                    res.status(201).json({ status: true })
                } catch (error) {
                    console.error("Error saving user to mongoDB", error);
                    res.status(500).json({ status: false, error: "Error creating user" })
                }
            }
        }
    },

    createAdmin: async (req, res) => {
        const flyAdmin = req.body;

        try {
            await admin.auth().getUserByEmail(flyAdmin.email);

            res.status(400).json({ message: 'Email already registered' })
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const userResponse = await admin.auth().createUser({
                        email: flyAdmin.email,
                        password: flyAdmin.password,
                        emailVerified: false,
                        disabled: false,
                    });

                    console.log(userResponse.uid);

                    const newFlyAdmin = new User({
                        fullname: flyAdmin.fullname,
                        email: flyAdmin.email,
                        password: CryptoJS.AES.encrypt(flyAdmin.password, process.env.SECRET).toString(),
                        uid: userResponse.uid,
                        userType: 'Admin'

                    })

                    await newFlyAdmin.save();
                    res.status(201).json({ status: true })
                } catch (error) {
                    console.error("Error saving user to mongoDB", error);
                    res.status(500).json({ status: false, error: "Error creating user" })
                }
            }
        }
    },

    createSuperAdmin: async (req, res) => {
        const superAdmin = req.body;

        try {
            await admin.auth().getUserByEmail(superAdmin.email);

            res.status(400).json({ message: 'Email already registered' })
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const userResponse = await admin.auth().createUser({
                        email: superAdmin.email,
                        password: superAdmin.password,
                        emailVerified: false,
                        disabled: false,
                    });

                    console.log(userResponse.uid);

                    const newSuperAdmin = new User({
                        fullname: superAdmin.fullname,
                        email: superAdmin.email,
                        password: CryptoJS.AES.encrypt(superAdmin.password, process.env.SECRET).toString(),
                        uid: userResponse.uid,
                        userType: 'SuperAdmin'
                    })

                    await newSuperAdmin.save();
                    res.status(201).json({ status: true })
                } catch (error) {
                    console.error("Error saving user to mongoDB", error);
                    res.status(500).json({ status: false, error: "Error creating user" })
                }
            }
        }
    },



    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email }, { __v: 0, updatedAt: 0, createdAt: 0 })
            !user && res.status(200).json("Wrong credentials")


            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const decrypted = decryptedPassword.toString(CryptoJS.enc.Utf8);

            decrypted !== req.body.password && res.status(401).json("Wrong email or password");

            const userToken = jwt.sign({
                id: user._id, userType: user.userType, email: user.email,
            }, process.env.JWT_SEC, { expiresIn: '21d' });

            //filter db to send back to user
            const { password, email, ...others } = user._doc;

            res.status(200).json({ ...others, userToken })
        } catch (error) {
            res.status(500).json({ status: false, error: error.message })
        }

    },

    forgotPassword: async (req, res) => {

        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ status: "Failed", message: "Email doesn't exist" });
            }
            const resetToken = user.generatePasswordResetToken();
            await user.save({ validateBeforeSave: false });

            const resetUrl = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`

            const body = "Forgot Password? Click on the given api: " + resetUrl;

            const msg = {
                to: user.email,
                from: "bobcatzephyr@gmail.com",
                subject: "Reset Password",
                text: body
            }

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            sgMail.send(msg)
                .then(() => {
                    res.status(200).json({
                        status: "Success",
                        message: "Password reset link sent to your email",
                    });
                })
                .catch((error) => {
                    console.error("SendGrid error:", error);
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save({ validateBeforeSave: false });
                    res.status(400).json({
                        status: "Failed",
                        message: "Error sending email: " + error.message,
                    });
                });

        } catch (error) {
            res.status(500).json({ status: false, error: error.message })
        }
    },

    resetPassword: async (req, res) => {
        try {
            
            const hashedToken = crypto.createHash("sha256").update(req.params.token).digest('hex');

            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: {$gt: Date.now()}
            });
            if (!user) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Invalid token or Token has expired",
                });
            }

            const newPassword = req.body.password;


            const encryptedPassword = CryptoJS.AES.encrypt(newPassword, process.env.SECRET).toString();
            user.password = encryptedPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            user.passwordChangedDate = Date.now()

            await user.save();

            const userToken = jwt.sign({
                id: user._id,
                userType: user.userType,
                email: user.email,
            }, process.env.JWT_SEC, { expiresIn: '21d' });

            res.status(200).json({ id: user._id, results: { userToken } });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    }

}