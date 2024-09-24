const validator = require('validator');

// Sanitize input fields to avoid XSS or malicious input
const sanitizeInput = (input) => {
    return input ? validator.escape(input.trim()) : ''; // Safely handle undefined inputs
};

// Forbidden symbols pattern
const forbiddenPattern = /[<>\/\\]/;

// Universal form data validation function
const validateFormData = (data) => {
    const {
        email, name, articleTitle, articleImage, articleContent,
        articleMetaTitle, articleMetaDescription, phone, textMessage
    } = data;

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedArticleTitle = sanitizeInput(articleTitle);
    const sanitizedArticleImage = sanitizeInput(articleImage);
    const sanitizedArticleContent = sanitizeInput(articleContent);
    const sanitizedArticleMetaTitle = sanitizeInput(articleMetaTitle);
    const sanitizedArticleMetaDescription = sanitizeInput(articleMetaDescription);
    const sanitizedPhone = sanitizeInput(phone || '');
    const sanitizedTextMessage = sanitizeInput(textMessage || '');

    let errors = {};  // To store field-specific errors

    // Check for forbidden symbols
    if (
        forbiddenPattern.test(sanitizedEmail) || 
        forbiddenPattern.test(sanitizedName) || 
        forbiddenPattern.test(sanitizedArticleTitle) || 
        forbiddenPattern.test(sanitizedArticleImage) || 
        forbiddenPattern.test(sanitizedArticleContent) || 
        forbiddenPattern.test(sanitizedArticleMetaTitle) || 
        forbiddenPattern.test(sanitizedArticleMetaDescription) || 
        forbiddenPattern.test(sanitizedPhone) || 
        forbiddenPattern.test(sanitizedTextMessage)
    ) {
        errors.global = 'Използване на забранени символи!';
    }

    // Validation for required fields and length
    if (!sanitizedArticleTitle || sanitizedArticleTitle.length < 2 || sanitizedArticleTitle.length > 100) {
        errors.articleTitle = sanitizedArticleTitle.length < 2 ? 'Моля въведете заглавие с поне 2 символа' : 'Заглавието е твърде дълго';
    }
    if (!sanitizedArticleImage || sanitizedArticleImage.length < 10 || sanitizedArticleImage.length > 255) {
        errors.articleImage = sanitizedArticleImage.length < 10 ? 'Моля въведете изображение с поне 10 символа' : 'URL на изображението е твърде дълъг';
    }
    if (!sanitizedArticleContent || sanitizedArticleContent.length < 10 || sanitizedArticleContent.length > 1000) {
        errors.articleContent = sanitizedArticleContent.length < 10 ? 'Моля въведете съдържание с поне 10 символа' : 'Съдържанието е твърде дълго';
    }
    if (!sanitizedArticleMetaTitle || sanitizedArticleMetaTitle.length < 2 || sanitizedArticleMetaTitle.length > 55) {
        errors.articleMetaTitle = sanitizedArticleMetaTitle.length < 2 ? 'Meta Title трябва да съдържа поне 2 символа' : 'Meta Title е твърде дълъг';
    }
    if (!sanitizedArticleMetaDescription || sanitizedArticleMetaDescription.length < 10 || sanitizedArticleMetaDescription.length > 136) {
        errors.articleMetaDescription = sanitizedArticleMetaDescription.length < 10 ? 'Meta Description трябва да съдържа поне 10 символа' : 'Meta Description е твърде дълга';
    }

    // If there are errors, throw them to be handled by the controller
    if (Object.keys(errors).length > 0) {
        const error = new Error('Некоректно попълнена форма');
        error.fields = errors;  // Pass field-specific errors
        throw error;
    }

    return true;  // If all validations pass, return true
};

module.exports = {
    validateFormData
};
