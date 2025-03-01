const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const {SECRET} = require('../config/config')

// Login with username and password
    exports.login = async (username, password) => {
        // Find user
        const user = await User.findOne({username});

        if (!user) {
            throw new Error('Invalid user or password!');
        };

        // Validate password with hash
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error('Invalid user or password!');
        };

        const token = await generateToken(user);
        return token;

    };

// exports.register = async (userData) => {
//     try {
//         console.log("manager received data: ", userData);

//         // Ensure password matches repeatPassword before proceeding
//         if (userData.password !== userData.repeatPassword) {
//             throw new Error('Passwords do not match!');
//         }

//         // Check if username already exists
//         const existingUser = await User.findOne({ 
//             $or: [{ username: userData.username }, { email: userData.email }]
//         });

//         if (existingUser) {
//             if (existingUser.username === userData.username) {
//                 throw new Error('Username is already taken!');
//             } else {
//                 throw new Error('Email is already registered!');
//             }
//         }

//         // Create the user
//         const createdUser = await User.create({
//             username: userData.username,
//             email: userData.email,
//             password: userData.password,  // Store only password
//         });

//         console.log("Successfully created user: ", createdUser);
        
//         const token = await generateToken(createdUser);
//         return token;

//     } catch (error) {
//         console.error("Error during registration:", error);
//         throw error; // Re-throw to be handled in the controller
//     }
// };

async function generateToken(user) {
    // Generate jwt
    const playload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const token = await jwt.sign(playload, SECRET, {expiresIn: '2d'});
    return token;
}
