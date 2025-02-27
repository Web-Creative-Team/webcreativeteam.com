// const { body } = require('express-validator');

// const articleValidationRules = [
//     body('articleContent')
//         .trim()
//         .customSanitizer(value => {
//             // Allow safe HTML tags and remove dangerous ones
//             return value
//                 .replace(/<script.*?>.*?<\/script>/gi, '')  // Remove <script> tags
//                 .replace(/<iframe.*?>.*?<\/iframe>/gi, '')  // Remove <iframe> tags
//                 .replace(/onerror|onload|javascript:/gi, '');  // Remove dangerous attributes
//         })
//         .custom((value) => {
//             // Check if content is empty
//             const plainText = value.replace(/<[^>]+>/g, '').trim();
//             if (!plainText) {
//                 throw new Error('Моля попълнете съдържанието на статията!');
//             }

//             // Check word count limit (2000 words)
//             const wordCount = plainText.split(/\s+/).length;
//             if (wordCount > 2000) {
//                 throw new Error('Съдържанието надвишава 2000 думи!');
//             }

//             return true;
//         })
// ];

// module.exports = {
//     articleValidationRules
// };



const { body } = require('express-validator');

const articleValidationRules = [
    body('articleTitle')
        .trim()
        .notEmpty().withMessage('Заглавието е задължително!')
        .isLength({ min: 3, max: 80 }).withMessage('Заглавието трябва да бъде между 3 и 80 символа!'),

    body('articleAlt')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 30 }).withMessage('Alt текстът трябва да бъде максимум 30 символа!'),

    body('articleContent')
        .trim()
        .customSanitizer(value => {
            // Sanitize HTML by removing dangerous tags
            return value
                .replace(/<script.*?>.*?<\/script>/gi, '')
                .replace(/<iframe.*?>.*?<\/iframe>/gi, '')
                .replace(/onerror|onload|javascript:/gi, '');
        })
        .custom(value => {
            // Check if the content is empty
            const plainText = value.replace(/<[^>]+>/g, '').trim();
            if (!plainText) {
                throw new Error('Моля попълнете съдържанието на статията!');
            }

            // Check word count limit (2000 words)
            const wordCount = plainText.split(/\s+/).length;
            if (wordCount > 2000) {
                throw new Error('Съдържанието надвишава 2000 думи!');
            }
            return true;
        }),

    body('articleMetaTitle')
        .trim()
        .notEmpty().withMessage('Meta Title е задължително поле!')
        .isLength({ max: 70 }).withMessage('Meta Title трябва да бъде максимум 70 символа!'),

    body('articleMetaDescription')
        .trim()
        .notEmpty().withMessage('Meta Description е задължително поле!')
        .isLength({ max: 160 }).withMessage('Meta Description трябва да бъде максимум 160 символа!'),
];

module.exports = {
    articleValidationRules
};
