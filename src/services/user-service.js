const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserRepository = require('../repository/user-repository');

const { JWT_KEY } = require('../config/serverConfig');
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user; 
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }   

    async signIn(email, plainPassword){
        try {
            //step 1:get user by email
            const user = await this.userRepository.getByEmail(email);
            //step 2:compare encrypted password with plain password
            const passwordsMatch = this.checkPassword(plainPassword, user.password);
            if(!passwordsMatch) {
                console.log("Password does not match");
                throw {error: "Incorrect Password"};
            }
            //step 3: if passwords match, create a new JWT token and sent it to the user
            const newJWT = this.createToken({email: user.email, id: user.id});
            return newJWT;

        } catch (error) {
            console.log("something went wrong in the signin process");
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
}

module.exports = UserService;