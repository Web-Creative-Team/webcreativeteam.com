const { getErrorMessage } = require('../utils/errorHelpers');

exports.errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message); // Log error for debugging

    // Send error message with red class to the frontend
    res.status(500).render('404', { 
        message: getErrorMessage(err),
        messageClass: 'red', // Pass the red class for errors
        title: "Error - Something went wrong",
        description: "An error occurred while processing your request." 
    });
};
