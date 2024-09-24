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

    // Check for missing required fields
    if (!sanitizedArticleTitle) {
        errors.articleTitle = 'Моля въведете заглавие';
    }
    if (!sanitizedArticleImage) {
        errors.articleImage = 'Моля въведете изображение';
    }
    if (!sanitizedArticleContent) {
        errors.articleContent = 'Моля въведете съдържание';
    }
    if (!sanitizedArticleMetaTitle || sanitizedArticleMetaTitle.length > 55) {
        errors.articleMetaTitle = sanitizedArticleMetaTitle.length > 55 ? 'Meta Title е твърде дълъг' : 'Моля въведете Meta Title';
    }
    if (!sanitizedArticleMetaDescription || sanitizedArticleMetaDescription.length > 136) {
        errors.articleMetaDescription = sanitizedArticleMetaDescription.length > 136 ? 'Meta Description е твърде дълго' : 'Моля въведете Meta Description';
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
