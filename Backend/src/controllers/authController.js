import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookie from "cookie-parser"
import client from "../config/redis.js"


export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({
                message: "name email and password required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User successfully created",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}



export const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                message: "email and password required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "Invalid email or password"
            })
        }

        const passwordMatched = await bcrypt.compare(password, user.password)

        if (!passwordMatched) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        const userProfile = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        await client.set(`user:${user._id}`, JSON.stringify(userProfile), { EX: 900 })

        // res.json({
        //     success: true,
        //     message: "Login successfull",
        //     data: {
        //         user: {
        //             id: user._id,
        //             name: user.name,
        //             email: user.email,
        //             role: user.role
        //         },
        //         accessToken: token
        //     }
        // })

        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
                path: "/"
            })
            .status(200)
            .json({
                success: true,
                message: "Login successful",
                user: userProfile
            });

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}




export const changePassword = async (req, res) => {
    try {
        const { password, new_password } = req.body

        if (!password || !new_password) {
            return res.json({
                success: false,
                message: "Old password and new password both are required"
            })
        }

        const user = await User.findOne({ email: req.user.email })

        console.log(req.user);



        if (!user) {
            return res.json({
                success: false,
                message: "user not found!"
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.json({
                success: false,
                message: "Invalid Password!"
            })
        }

        const hashedPassword = await bcrypt.hash(new_password, 12)

        user.password = hashedPassword

        await user.save()


        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });


    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}


// 

export const getMe = async (req, res) => {
    try {
        // Check karein ki req.user ya userId exist karta hai ya nahi
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, user ID missing"
            });
        }

        // Redis key mein "user:" prefix lagana zaroori hai (jaise login mein lagaya tha)
        const getUser = await client.get(`user:${req.user.userId}`);

        if (getUser) {
            return res.status(200).json({
                success: true,
                user: JSON.parse(getUser)
            });
        }

        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};




























