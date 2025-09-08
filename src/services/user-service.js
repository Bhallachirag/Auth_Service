const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_KEY } = require('../config/serverConfig');

const UserRepository = require('../repository/user-repository');
const AppErrors = require('../utils/error-handler');
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user; 
        } catch (error) {
            if(error.name === 'SequelizeValidationError'){
                throw error;
            }
            console.log("Something went wrong in service layer");
            throw error;
        }
    }   

    async signIn(email, plainPassword){
        try {
            const user = await this.userRepository.getByEmail(email);
            const passwordsMatch = this.checkPassword(plainPassword, user.password);
            if(!passwordsMatch) {
                console.log("Password does not match");
                throw {error: "Incorrect Password"};
            }
            const newJWT = this.createToken({email: user.email, id: user.id});
            return newJWT;

        } catch (error) {
            if(error.name == 'AttributeNotFound') {
                throw error;
            }
            console.log("something went wrong in the signin process");
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if(!response) {
                throw {error: "Invalid Token"};
            }
            const user = await this.userRepository.getById(response.id);
            if(!user) {
                throw {error: "No user with the corresponding token exists"};
            }
            return user.id;
        } catch (error) {
            console.log("something went wrong in auth process");
            throw error;
        }
    }

    createToken(user) {
        try {   
            const result = jwt.sign(user, JWT_KEY, {expiresIn: '1d'});
            return result;
        } catch (error) {
            console.log("Something went wrong while creating token");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong while verifying token",error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrongin password comparison");
            throw error;
        }
    }

    isAdmin(userId) {
         try {
            return this.userRepository.isAdmin(userId);
         } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
         }
    }

    async getUserById(userId) {
        try {
            const user = await this.userRepository.getByIdWithDetails(userId);
            return user;
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }

    async getUserInfo(token) {
        try {
            const authResponse = await this.isAuthenticated(token);
            if (!authResponse.success) {
                throw {
                    error: "Invalid token",
                    statusCode: 401
                };
            }

            const userId = authResponse.data.id;
            const user = await this.userRepository.getUserInfo(userId);
            return user;
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw {
                    error: "User not found",
                    statusCode: 404
                };
            }
            return user;
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }
}

module.exports = UserService;