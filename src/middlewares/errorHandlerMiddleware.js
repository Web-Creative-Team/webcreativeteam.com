// const { getErrorMessage } = require('../utils/errorHelpers')

// exports.errorHandler = (err, req, res) => {

//     res.render('404', { error: getErrorMessage(err) });
    
// };


const { getErrorMessage } = require('../utils/errorHelpers');

exports.errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message); // Log error for debugging

    // Send error message to the frontend
    res.status(500).render('404', { 
        error: getErrorMessage(err),
        title: "Error - Something went wrong",
        description: "An error occurred while processing your request." 
    });
};
