import jwt from "jsonwebtoken"
import User from "../models/user.js"



export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        let token;

        if (authHeader) {
            const [type, headerToken] = authHeader.split(' ')

            if (type !== "Bearer" || !headerToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. No token provided or invalid format.'
                });
            }

            token = headerToken
        } else {
            token = req.cookies?.token;
        }

        console.log(req.cookies.token);
        

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. User no longer exists.'
            });
        }

        req.user = user

        next()

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
            error: err.message
        });
    }
}

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user?.role}' is not authorized to perform this action.`
            });
        }
        next()
    }
}