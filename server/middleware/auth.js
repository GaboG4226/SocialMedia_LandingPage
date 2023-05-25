import jwt from 'jsonwebtoken';

// Methios to add security in the moment of the authentication
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token){
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); // if not verified it thows an error
        req.user = verified; // if verified it returns the payloas
        next(); // go to the next function that was passed as an argument

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}