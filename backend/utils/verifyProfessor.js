
export const verifyProfessor = async (req, res, next) => {
    try {
        const userRole = req.user.user.role;
        if (userRole.includes("professor")) {
            next();
        } else {
            return res.status(403).json({
                error: {
                    message: "You are not authorized to access this route",
                    code: 403
                }
            });
        }
    } catch (error) {
        console.log(`Error in verifyProfessor  middleware: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}