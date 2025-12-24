import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization")

        if (!token) {
            return res.status(403).send('Access Denied !')
        }

        if (token.startsWith("Bearer ")){
            // Fixed by AI: Replaced deprecated trimLeft() with trimStart()
            token = token.slice(7, token.length).trimStart()
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}