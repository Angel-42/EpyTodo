const jwt = require('jsonwebtoken');


function generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send("Token is not valid");
    } try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("No token, authorization denied")
    }
    return next();
}

module.exports = {
    generateToken,
    verifyToken
};
