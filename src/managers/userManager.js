const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const { SECRET } = require('../config/config');

// Login with username and password
exports.login = async (username, password) => {
    // Find user
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('Invalid user or password!');
    }

    // Validate password with hash
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid user or password!');
    }

    const token = await generateToken(user);
    return token;
};

// Register with username and password
exports.register = async (userData) => {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: userData.username });

    if (existingUser) {
        throw new Error('Username already exists!');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Create the user
    const createdUser = await User.create(userData);

    // Generate token for the new user
    const token = await generateToken(createdUser);
    return token;
};

async function generateToken(user) {
    // Generate JWT
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: '2d' });
    return token;
}
