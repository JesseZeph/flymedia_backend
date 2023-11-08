const User = require('../models/User')
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const sgMail = require("@sendgrid/mail")


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
                        userType: 'Client'

                    })

                    await newUser.save();
                    res.status(201).json({status: true})
                } catch (error) {
                    console.error("Error saving user to mongoDB", error);
                    res.status(500).json({status: false, error: "Error creating user"})
                }
            }
            
        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email},{ __v: 0, updatedAt: 0, createdAt: 0})
            !user && res.status(200).json("Wrong credentials")


            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const decrypted = decryptedPassword.toString(CryptoJS.enc.Utf8);

            decrypted !== req.body.password && res.status(401).json("Wrong email or password");

            const userToken = jwt.sign({
                id: user._id, userType:user.userType, email: user.email,
            }, process.env.JWT_SEC, {expiresIn: '21d'});

            //filter db to send back to user
            const {password, email, ...others} = user._doc;

            res.status(200).json({...others, userToken})


        } catch (error) {
            res.status(500).json({status: false, error: error.message})            
        }
    
    },

    forgotPassword: async ( req, res) => {
        const user = await User.findOne({ email: req.body.email})

        try {
            if(user) {
                const userToken = jwt.sign({
                    id: user._id, userType:user.userType, email: user.email,
                }, process.env.JWT_SEC, {expiresIn: '2h'});   
                user.resetToken = userToken
                user.resetExpires = Date.now() + 5 * 60 * 1000;

                await user.save() 
                
                const resetUrl = `${req.protocol}://${req.get("host")}/resetPassword/${userToken}`

                const body = "Forgot Password? Click on the given api: " + resetUrl;

                const msg = {
                    to: user.email,
                    from: "bobcatzephyr@gmail.com",
                    subject: "Reset Password",
                    text: body
                }

                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                sgMail.send(msg).then(() => {
                    res.status(200).json({
                        status: "Success", message: "Password reset link sent to your email", resetToken: userToken
                    })
                    console.log(msg);
                }).catch((error) => {
                    res.status(400).json({status: "Failed", message: error.message})
                });
             }
        } catch (error) {
            res.status(500).json({status: false, error: error.message})            
        }
    },

    resetPassword: async (req, res) => {
        try {
            const generatedToken = req.params.token;
            const newPassword = req.body.password;
    
            const user = await User.findOne({
                resetToken: generatedToken,
                resetExpires: {$gt: Date.now()}
            });
    
            if (!user) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Invalid token or Token has expired",
                });
            }
    
            const encryptedPassword = CryptoJS.AES.encrypt(newPassword, process.env.SECRET).toString();
            user.password = encryptedPassword;
            user.resetToken = undefined;
            user.resetExpires = undefined;
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