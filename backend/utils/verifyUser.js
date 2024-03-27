import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            console.log(token);
            return res.status(401).json({ message: "Unauthorized" });
            
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        //console.log(req.user);
        next();
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


