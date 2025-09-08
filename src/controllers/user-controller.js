const { StatusCodes } = require('http-status-codes');
const UserService = require('../services/user-service');

const userService = new UserService();

const create = async (req, res) => {
    try {
        const response = await userService.create({
            email: req.body.email,
            password: req.body.password,
            mobileNumber: req.body.mobileNumber
        });
        return res.status(201).json({
            success: true,
            message: "Successfully created a user", 
            data: response,
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json({
            message: error.message,
            data: {},
            success: false,
            err:error.explanation
        });
    }
}

const signIn = async (req, res) => {
    try {
        const response = await userService.signIn(req.body.email, req.body.password);
        return res.status(200).json({
            success: true,
            message: "Successfully signed in",
            data: response,
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            data: {},
            success: false,
            err:error.explanation
        });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticated(token);
        return res.status(200).json({
            success: true,
            message: "User is authenticated and token is valid",
            data: response,
            err: {}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong in controller layer",
            data: {},
            success: false,
            err:error
        });
    }
}

const isAdmin = async (req, res) => {
    try {
        const response = await userService.isAdmin(req.body.id);
        return res.status(200).json({
            success: true,
            message: "Successfully fetched whether user is admin or not",
            data: response,
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong in controller layer",
            data: {},
            success: false,
            err:error
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const response = await userService.getUserById(req.params.id);
        return res.status(200).json({ 
            success: true, 
            data: response 
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.error || error.message || 'Internal Server Error' 
        });
    }
}

const getUserInfo = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token missing' 
            });
        }

        const response = await userService.getUserInfo(token);
        return res.status(200).json({ 
            success: true, 
            data: response 
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.error || error.message || 'Internal Server Error' 
        });
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const response = await userService.getUserByEmail(req.params.email);
        return res.status(200).json({ 
            success: true, 
            data: response 
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.error || error.message || 'Internal Server Error' 
        });
    }
}



module.exports = {
    create,
    signIn,
    isAuthenticated,
    isAdmin,
    getUserById,
    getUserInfo,
    getUserByEmail
};