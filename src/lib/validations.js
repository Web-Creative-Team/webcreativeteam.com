const validator = require('validator');

// Sanitize input fields to avoid XSS or malicious input
const sanitizeInput = (input) => {
    return input ? validator.escape(input.trim()) : ''; // Safely handle undefined inputs
};

// Forbidden symbols pattern
const forbiddenPattern = /[<>\/\\]/;

// Universal form data validation function
const validateFormData = (data, formType) => {
    let errors = {};  // To store field-specific errors

    // Sanitize and validate banner fields if formType is 'banner'
    if (formType === 'banner') {
        const { bannerImage, bannerTitle, bannerSubtitle } = data;

        const sanitizedBannerImage = sanitizeInput(bannerImage);
        const sanitizedBannerTitle = sanitizeInput(bannerTitle);
        const sanitizedBannerSubtitle = sanitizeInput(bannerSubtitle);

        // Check for forbidden symbols
        if (forbiddenPattern.test(sanitizedBannerImage) || forbiddenPattern.test(sanitizedBannerTitle) || forbiddenPattern.test(sanitizedBannerSubtitle)) {
            errors.global = 'Използване на забранени символи!';
        }

        // Validate required fields
        if (!sanitizedBannerImage || sanitizedBannerImage.length < 10) {
            errors.bannerImage = 'Изображението трябва да съдържа поне 10 символа';
        }
        if (!sanitizedBannerTitle || sanitizedBannerTitle.length < 2) {
            errors.bannerTitle = 'Заглавието трябва да съдържа поне 2 символа';
        }
        if (!sanitizedBannerSubtitle || sanitizedBannerSubtitle.length < 2) {
            errors.bannerSubtitle = 'Подзаглавието трябва да съдържа поне 2 символа';
        }

        // Throw errors if there are any
        if (Object.keys(errors).length > 0) {
            const error = new Error('Некоректно попълнена форма');
            error.fields = errors;  // Attach the field-specific errors
            throw error;
        }
    }
};

module.exports = {
    validateFormData
};
