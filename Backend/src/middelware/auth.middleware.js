import jwt from 'jsonwebtoken'



export const authMiddleware = async (req, res, next) => {
    const  token  = req.cookies.token

    if (!token) {
        res.status(400).json({
            message: 'token is invalid',
            success: false,
            err: 'token is not valid'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (error) {
        res.status(500).json({
            message: 'Unautorize',
            success: false,
            err: 'error in middleware'
        })

    }




}