const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    }
});

// userSchema.virtual('repeatPassword')
//     .set(function (value) {
//         if (this.password !== value) {
//             throw new Error('Password missmatch')
//         }
//     });

userSchema.pre('save', async function () {
    console.log("Before hashing, password:", this.password);
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    console.log("After hashing, password:", this.password);
});

const User = mongoose.model('User', userSchema);

module.exports = User;