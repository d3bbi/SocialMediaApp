const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const {validateRegisterInput, validateLoginInput} = require('../../util/validator')
const {SECRET_KEY} = require('../../config')
const User = require('../../models/User');

/*function that generates a token for each new registered user - functionality of jsonwebtoken*/
function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SECRET_KEY, {expiresIn: '1h'});
}

/**mutation returned*/
module.exports ={
    Mutation: {
        /*Login check
         * first we check if the inputs are valid (validateLoginInput returns valid and error)
        */
        async login(_,{username, password}){
            const{valid, errors} = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors', {errors});
            }

            //if the inputs are valid - check if the user exists
            const user = await User.findOne({username})

            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }
            //with the bcryptjs we check if the password match
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }

            //if match we generate token
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },

        /*Registration check */
        async register(_, {registerInput: {username, email, password, confirmPassword}}){
            
            //validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors',{ errors })
            }

            //Make sure user doesnt already exist
            const user = await User.findOne({ username });
            if (user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            })
            
            const res = await newUser.save();
            const token = generateToken(res);
 
            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}