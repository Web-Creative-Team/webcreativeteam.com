const validator = require('validator');

// Sanitize input fields to avoid XSS or malicious input
const sanitizeInput = (input) => {
    return input ? validator.escape(input.trim()) : ''; // Safely handle undefined inputs
};

// Forbidden symbols pattern
const forbiddenPattern = /[<>\/\\]/;

// Universal form data validation function
const validateFormData = (data, formType = 'article') => {
    // Sanitize all inputs based on form type
    const {
        email, name, phone, textMessage,
        articleTitle, articleImage, articleContent,
        articleMetaTitle, articleMetaDescription,
        bannerImage, bannerTitle, bannerSubtitle
    } = data;

    let errors = {}; // To store field-specific errors

    // Check for forbidden symbols
    Object.keys(data).forEach((key) => {
        const sanitizedValue = sanitizeInput(data[key]);
        if (forbiddenPattern.test(sanitizedValue)) {
            errors.global = 'Използване на забранени символи!';
        }
    });

    // Article validations
    if (formType === 'article') {
        if (!articleTitle || articleTitle.length < 2 || articleTitle.length > 100) {
            errors.articleTitle = articleTitle?.length < 2 ? 'Моля въведете заглавие с поне 2 символа' : 'Заглавието е твърде дълго';
        }
        if (!articleImage || articleImage.length < 10 || articleImage.length > 255) {
            errors.articleImage = articleImage?.length < 10 ? 'Моля въведете изображение с поне 10 символа' : 'URL на изображението е твърде дълъг';
        }
        if (!articleContent || articleContent.length < 10 || articleContent.length > 1000) {
            errors.articleContent = articleContent?.length < 10 ? 'Моля въведете съдържание с поне 10 символа' : 'Съдържанието е твърде дълго';
        }
        if (!articleMetaTitle || articleMetaTitle.length < 2 || articleMetaTitle.length > 55) {
            errors.articleMetaTitle = articleMetaTitle?.length < 2 ? 'Meta Title трябва да съдържа поне 2 символа' : 'Meta Title е твърде дълъг';
        }
        if (!articleMetaDescription || articleMetaDescription.length < 10 || articleMetaDescription.length > 136) {
            errors.articleMetaDescription = articleMetaDescription?.length < 10 ? 'Meta Description трябва да съдържа поне 10 символа' : 'Meta Description е твърде дълга';
        }
    }

    // Banner validations
    if (formType === 'banner') {
        if (!bannerImage || bannerImage.length < 10 || bannerImage.length > 255) {
            errors.bannerImage = bannerImage?.length < 10 ? 'Моля въведете изображение с поне 10 символа' : 'URL на изображението е твърде дълъг';
        }
        if (!bannerTitle || bannerTitle.length < 2 || bannerTitle.length > 100) {
            errors.bannerTitle = bannerTitle?.length < 2 ? 'Моля въведете заглавие с поне 2 символа' : 'Заглавието е твърде дълго';
        }
        if (!bannerSubtitle || bannerSubtitle.length < 2 || bannerSubtitle.length > 100) {
            errors.bannerSubtitle = bannerSubtitle?.length < 2 ? 'Подзаглавието трябва да съдържа поне 2 символа' : 'Подзаглавието е твърде дълго';
        }
    }

    // If there are errors, throw them to be handled by the controller
    if (Object.keys(errors).length > 0) {
        const error = new Error('Некоректно попълнена форма');
        error.fields = errors; // Pass field-specific errors
        throw error;
    }

    return true; // If all validations pass, return true
};

module.exports = {
    validateFormData
};
