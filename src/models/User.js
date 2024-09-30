const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Потребителското име е задължително'], // "Username is required"
    unique: true,
    minlength: [3, 'Потребителското име трябва да бъде поне 3 символа'], // "Username must be at least 3 characters"
  },
  email: {
    type: String,
    required: [true, 'E-mail е задължителен'], // "Email is required"
    unique: true,
    validate: {
      validator: function (v) {
        // Email validation regex
        return /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/.test(v);
      },
      message: 'Невалиден e-mail', // "Invalid email"
    },
  },
  password: {
    type: String,
    required: [true, 'Паролата е задължителна'], // "Password is required"
    minlength: [6, 'Паролата трябва да бъде поне 6 символа'], // "Password must be at least 6 characters"
  },
});


module.exports = mongoose.model('User', userSchema);
