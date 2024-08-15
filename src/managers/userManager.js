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

    //Login withe email and password
    // exports.login = async (email, password) => {
    //     // Find user
    //     const user = await User.findOne({email});

    //     if (!user) {
    //         throw new Error('Invalid user or password!');
    //     };

    //     // Validate password with hash
    //     const isValid = await bcrypt.compare(password, user.password);

    //     if (!isValid) {
    //         throw new Error('Invalid user or password!');
    //     };

    //     const token = await generateToken(user);
    //     return token;

    // };

    // Register with username and password
exports.register = async (userData) => {
    const user = await User.findOne({ username: userData.username });

    if (user) {
        throw new Error('Username already exissts!')
    };

    // After register - redirect
    //return User.create(userData);

    //If we want to be logged in immediately after register
    const createdUser = await User.create(userData);
    const token = await generateToken(createdUser);
    console.log(createdUser);
    return token;
};

// // Register with email and password
// exports.register = async (userData) => {
//     const user = await User.findOne({ email: userData.email });

//     if (user) {
//         throw new Error('Email already exissts!')
//     };

//     // After register - redirect
//     //return User.create(userData);

//     //If we want to be logged in immediately after register
//     const createdUser = await User.create(userData);
//     const token = await generateToken(createdUser);
//     return token;
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
