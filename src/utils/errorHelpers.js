const mongoose = require("mongoose");

// exports.getErrorMessage = (err) => {

//     if (err instanceof mongoose.MongooseError || err instanceof mongoose.Error.ValidationError) {

//         return Object.values(err.errors).at(0).message;
  
//     } else {

//         return err.message;
//     }
// }

// exports.getErrorMessage = (err) => {
//     if (err instanceof mongoose.MongooseError || err instanceof mongoose.Error.ValidationError) {
//         // Collect all validation error messages
//         const errorMessages = Object.values(err.errors).map(error => error.message);
//         return errorMessages;
//     } else {
//         return [err.message]; // Ensure it's always returned as an array
//     }
// };


exports.getErrorMessage = (err) => {
    if (err instanceof mongoose.MongooseError || err instanceof mongoose.Error.ValidationError) {
        const errorMessages = [];
        const invalidFields = {};

        let emptyFields = false;
        let forbiddenChars = false;

        Object.values(err.errors).forEach(error => {
            const field = error.path; 

            // Check for missing fields
            if (error.kind === "required") {
                emptyFields = true;
                invalidFields[field] = true;
            } 
            // Check for forbidden characters
            else if (error.kind === "regexp") {
                forbiddenChars = true;
                invalidFields[field] = true;
            } 
            // General validation error
            else {
                errorMessages.push(error.message);
                invalidFields[field] = true;
            }
        });

        // Prioritize messages based on validation type
        if (emptyFields) errorMessages.unshift("Моля попълнете всички задължителни полета!\n");
        if (forbiddenChars) errorMessages.push("Използване на забранени символи!");

        return { messages: errorMessages, fields: invalidFields };
    } 
    else {
        return { messages: [err.message], fields: {} };
    }
};
