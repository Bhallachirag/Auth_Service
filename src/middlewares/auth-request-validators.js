const validateUserAuth = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
            data: {},
            err: 'Email or password missing in the request'
        });
    }
    next();
}

const validateIsAdminRequest = (req, res, next) => {
    if(!req.body.id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            data: {},
            err: 'User ID missing in the request'
        });
    }
    next();
}

module.exports = {
    validateUserAuth,
    validateIsAdminRequest    
} 