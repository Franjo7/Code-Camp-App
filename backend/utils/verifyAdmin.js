
// Ovaj middleware se koristi za provjeru da li je korisnik admin ili ne.
export const verifyAdmin = async (req, res, next) => {
    try {
        const userRole = req.user.user.role;
        if (userRole.includes("admin")) {
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
        console.log(`Error in verifyAdmin  middleware: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}