// document.getElementById('contactForm').onsubmit = function (event) {
//     // Get all form inputs
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone');
//     const messageInput = document.getElementById('message');

//     // Get the <p> right after each field (the default help/error text)
//     const nameError    = nameInput.nextElementSibling;
//     const emailError   = emailInput.nextElementSibling;
//     const phoneError   = phoneInput.nextElementSibling;
//     const messageError = messageInput.nextElementSibling;

//     // Keep the original help text so we can restore it if the field is valid
//     const defaultNameError    = nameError.textContent;
//     const defaultEmailError   = emailError.textContent;
//     const defaultPhoneError   = phoneError.textContent;
//     const defaultMessageError = messageError.textContent;

//     // Assume form is valid unless a field check fails
//     let valid = true;

//     // Forbid < or > anywhere in the input (common for blocking HTML/script tags)
//     const forbiddenPattern = /[<>]/;

//     // Helper to mark a field invalid with a custom message
//     function invalidateField(inputElem, errorElem, message) {
//         errorElem.textContent = message;
//         errorElem.classList.add('red');
//         if (valid) {
//             // Focus the first invalid field we encounter
//             inputElem.focus();
//         }
//         valid = false;
//     }

//     // ------------ NAME FIELD VALIDATION ------------
//     if (forbiddenPattern.test(nameInput.value)) {
//         invalidateField(nameInput, nameError, 'Използване на забранени символи');
//     } else {
//         // Must be at least 2 chars, only letters/spaces
//         const namePattern = /^[a-zA-Z\s]+$/;
//         if (!nameInput.value || nameInput.value.length < 2 || !namePattern.test(nameInput.value)) {
//             invalidateField(nameInput, nameError, 'Името трябва да съдържа поне 2 символа');
//         } else {
//             // Valid: restore the default text & remove red
//             nameError.textContent = defaultNameError;
//             nameError.classList.remove('red');
//         }
//     }

//     // ------------ EMAIL FIELD VALIDATION ------------
//     if (forbiddenPattern.test(emailInput.value)) {
//         invalidateField(emailInput, emailError, 'Използване на забранени символи');
//     } else {
//         // Must follow a valid email pattern
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailInput.value || !emailPattern.test(emailInput.value)) {
//             invalidateField(emailInput, emailError, 'Моля въведете валиден Email адрес');
//         } else {
//             emailError.textContent = defaultEmailError;
//             emailError.classList.remove('red');
//         }
//     }

//     // ------------ PHONE FIELD VALIDATION (Optional) ------------
//     if (forbiddenPattern.test(phoneInput.value)) {
//         invalidateField(phoneInput, phoneError, 'Използване на забранени символи');
//     } else {
//         // Assuming phone is optional & no length checks
//         phoneError.textContent = defaultPhoneError;
//         phoneError.classList.remove('red');
//     }

//     // ------------ MESSAGE FIELD VALIDATION ------------
//     if (forbiddenPattern.test(messageInput.value)) {
//         invalidateField(messageInput, messageError, 'Използване на забранени символи');
//     } else {
//         // Must be 10-1000 characters
//         if (!messageInput.value || messageInput.value.length < 10 || messageInput.value.length > 1000) {
//             invalidateField(messageInput, messageError, 'Съобщението ви трябва да съдържа поне 10 символа');
//         } else {
//             messageError.textContent = defaultMessageError;
//             messageError.classList.remove('red');
//         }
//     }

//     // If any field was invalid, stop the form submission
//     if (!valid) {
//         event.preventDefault();
//     }
// };

// // Keep your existing onload/focus logic
// window.onload = function () {
//     const focusField = document.getElementById('focusField').value;
//     if (focusField) {
//         document.getElementById(focusField).focus();
//     }
// };



/**********************************************
  1) Helper: Set a Global Message (Red/Green)
**********************************************/
function setGlobalMessage(msg, color) {
    // We assume there's a <div class="messageContainer"> somewhere on the page
    const globalMessageContainer = document.querySelector('.messageContainer');
    if (!globalMessageContainer) {
        return; // If there's no global message container, do nothing
    }

    // Clear any existing content/classes
    globalMessageContainer.innerHTML = '';
    globalMessageContainer.classList.remove('red', 'green');

    // Set new content and color (red or green)
    globalMessageContainer.innerHTML = `<p class="messageText">${msg}</p>`;
    globalMessageContainer.classList.add(color);
}

/**********************************************
  2) Helper: Check for Forbidden Input
     - Blocks literal <, >
     - Blocks &lt;, &gt;
     - Blocks 'script' or 'iframe' in any case
**********************************************/
function hasForbiddenChars(value) {
    // You can add more substrings if needed (e.g., 'onload', 'javascript:', etc.)
    const forbiddenPattern = /<|>|&lt;|&gt;|script|iframe/gi;
    return forbiddenPattern.test(value);
}

/**********************************************
  3) VALIDATION: Contact Form
**********************************************/
function validateContactForm(event) {
    // Grab elements
    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const phoneInput   = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Grab the <p> (help/error text) after each field
    const nameError    = nameInput.nextElementSibling;
    const emailError   = emailInput.nextElementSibling;
    const phoneError   = phoneInput.nextElementSibling;
    const messageError = messageInput.nextElementSibling;

    // Store default text (so we can restore it if valid)
    const defaultNameError    = nameError.textContent;
    const defaultEmailError   = emailError.textContent;
    const defaultPhoneError   = phoneError.textContent;
    const defaultMessageError = messageError.textContent;

    let valid = true;

    // Helper to invalidate a single field
    function invalidateField(inputElem, errorElem, errorMsg) {
        errorElem.textContent = errorMsg;
        errorElem.classList.add('red');
        if (valid) {
            inputElem.focus(); // Focus the first invalid field
        }
        valid = false;
    }

    // --- NAME ---
    if (!nameInput.value.trim()) {
        // Empty name
        invalidateField(nameInput, nameError, defaultNameError);
    } else if (hasForbiddenChars(nameInput.value)) {
        invalidateField(nameInput, nameError, 'Използване на забранени символи!');
    } else {
        // Must be at least 2 chars, only letters/spaces
        const namePattern = /^[a-zA-Z\s]+$/;
        if (nameInput.value.length < 2 || !namePattern.test(nameInput.value)) {
            invalidateField(nameInput, nameError, defaultNameError);
        } else {
            // Passed
            nameError.textContent = defaultNameError;
            nameError.classList.remove('red');
        }
    }

    // --- EMAIL ---
    if (!emailInput.value.trim()) {
        // Empty email
        invalidateField(emailInput, emailError, defaultEmailError);
    } else if (hasForbiddenChars(emailInput.value)) {
        invalidateField(emailInput, emailError, 'Използване на забранени символи!');
    } else {
        // Basic email regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            invalidateField(emailInput, emailError, defaultEmailError);
        } else {
            emailError.textContent = defaultEmailError;
            emailError.classList.remove('red');
        }
    }

    // --- PHONE (Optional) ---
    if (hasForbiddenChars(phoneInput.value)) {
        invalidateField(phoneInput, phoneError, 'Използване на забранени символи!');
    } else {
        // Not strictly required => no length check if empty
        phoneError.textContent = defaultPhoneError;
        phoneError.classList.remove('red');
    }

    // --- MESSAGE ---
    if (!messageInput.value.trim()) {
        // Empty message
        invalidateField(messageInput, messageError, defaultMessageError);
    } else if (hasForbiddenChars(messageInput.value)) {
        invalidateField(messageInput, messageError, 'Използване на забранени символи!');
    } else {
        // Must be 10-1000 chars
        if (messageInput.value.length < 10 || messageInput.value.length > 1000) {
            invalidateField(messageInput, messageError, defaultMessageError);
        } else {
            messageError.textContent = defaultMessageError;
            messageError.classList.remove('red');
        }
    }

    // --- Final Step: Global Message if invalid ---
    if (!valid) {
        event.preventDefault();
        setGlobalMessage('Неуспешно създаване на ресурс', 'red');
    } else {
        // Let the form submit
        setGlobalMessage('Ресурсът е създаден!', 'green');
    }
}

/**********************************************
  4) VALIDATION: Create Article Form
**********************************************/
function validateCreateArticleForm(event) {
    const articleTitle           = document.getElementById('articleTitle');
    const articleImage           = document.getElementById('articleImage');
    const articleContent         = document.getElementById('articleContent');
    const articleMetaTitle       = document.getElementById('articleMetaTitle');
    const articleMetaDescription = document.getElementById('articleMetaDescription');

    // <p> after each input
    const titleError           = articleTitle.nextElementSibling;
    const imageError           = articleImage.nextElementSibling;
    const contentError         = articleContent.nextElementSibling;
    const metaTitleError       = articleMetaTitle.nextElementSibling;
    const metaDescriptionError = articleMetaDescription.nextElementSibling;

    // Default texts
    const defaultTitleErr       = titleError.textContent;
    const defaultImageErr       = imageError.textContent;
    const defaultContentErr     = contentError.textContent;
    const defaultMetaTitleErr   = metaTitleError.textContent;
    const defaultMetaDescErr    = metaDescriptionError.textContent;

    let valid = true;

    function invalidateField(inputElem, errorElem, msg) {
        errorElem.textContent = msg;
        errorElem.classList.add('red');
        if (valid) {
            inputElem.focus();
        }
        valid = false;
    }

    // --- Title ---
    if (!articleTitle.value.trim()) {
        invalidateField(articleTitle, titleError, defaultTitleErr);
    } else if (hasForbiddenChars(articleTitle.value)) {
        invalidateField(articleTitle, titleError, 'Използване на забранени символи!');
    } else if (articleTitle.value.length < 2) {
        invalidateField(articleTitle, titleError, defaultTitleErr);
    } else {
        titleError.textContent = defaultTitleErr;
        titleError.classList.remove('red');
    }

    // --- Image URL ---
    if (!articleImage.value.trim()) {
        invalidateField(articleImage, imageError, defaultImageErr);
    } else if (hasForbiddenChars(articleImage.value)) {
        invalidateField(articleImage, imageError, 'Използване на забранени символи!');
    } else {
        imageError.textContent = defaultImageErr;
        imageError.classList.remove('red');
    }

    // --- Content ---
    if (!articleContent.value.trim()) {
        invalidateField(articleContent, contentError, defaultContentErr);
    } else if (hasForbiddenChars(articleContent.value)) {
        invalidateField(articleContent, contentError, 'Използване на забранени символи!');
    } else if (articleContent.value.length < 10) {
        invalidateField(articleContent, contentError, defaultContentErr);
    } else {
        contentError.textContent = defaultContentErr;
        contentError.classList.remove('red');
    }

    // --- Meta Title ---
    if (!articleMetaTitle.value.trim()) {
        invalidateField(articleMetaTitle, metaTitleError, defaultMetaTitleErr);
    } else if (hasForbiddenChars(articleMetaTitle.value)) {
        invalidateField(articleMetaTitle, metaTitleError, 'Използване на забранени символи!');
    } else if (articleMetaTitle.value.length > 55) {
        invalidateField(articleMetaTitle, metaTitleError, defaultMetaTitleErr);
    } else {
        metaTitleError.textContent = defaultMetaTitleErr;
        metaTitleError.classList.remove('red');
    }

    // --- Meta Description ---
    if (!articleMetaDescription.value.trim()) {
        invalidateField(articleMetaDescription, metaDescriptionError, defaultMetaDescErr);
    } else if (hasForbiddenChars(articleMetaDescription.value)) {
        invalidateField(articleMetaDescription, metaDescriptionError, 'Използване на забранени символи!');
    } else if (articleMetaDescription.value.length > 136) {
        invalidateField(articleMetaDescription, metaDescriptionError, defaultMetaDescErr);
    } else {
        metaDescriptionError.textContent = defaultMetaDescErr;
        metaDescriptionError.classList.remove('red');
    }

    // --- Final Step ---
    if (!valid) {
        event.preventDefault();
        setGlobalMessage('Неуспешно създаване на ресурс', 'red');
    } else {
        setGlobalMessage('Ресурсът е създаден!', 'green');
    }
}

/**********************************************
  5) VALIDATION: Create Banner Form
**********************************************/
function validateCreateBannerForm(event) {
    const bannerImage    = document.getElementById('bannerImage');
    const bannerTitle    = document.getElementById('bannerTitle');
    const bannerSubtitle = document.getElementById('bannerSubtitle');

    const imageError    = bannerImage.nextElementSibling;
    const titleError    = bannerTitle.nextElementSibling;
    const subtitleError = bannerSubtitle.nextElementSibling;

    // Default text
    const defaultImageErr    = imageError.textContent;
    const defaultTitleErr    = titleError.textContent;
    const defaultSubtitleErr = subtitleError.textContent;

    let valid = true;

    function invalidateField(inputElem, errorElem, msg) {
        errorElem.textContent = msg;
        errorElem.classList.add('red');
        if (valid) {
            inputElem.focus();
        }
        valid = false;
    }

    // --- Banner Image ---
    if (!bannerImage.value.trim()) {
        invalidateField(bannerImage, imageError, defaultImageErr);
    } else if (hasForbiddenChars(bannerImage.value)) {
        invalidateField(bannerImage, imageError, 'Използване на забранени символи!');
    } else {
        imageError.textContent = defaultImageErr;
        imageError.classList.remove('red');
    }

    // --- Banner Title ---
    if (!bannerTitle.value.trim()) {
        invalidateField(bannerTitle, titleError, defaultTitleErr);
    } else if (hasForbiddenChars(bannerTitle.value)) {
        invalidateField(bannerTitle, titleError, 'Използване на забранени символи!');
    } else {
        titleError.textContent = defaultTitleErr;
        titleError.classList.remove('red');
    }

    // --- Banner Subtitle ---
    if (!bannerSubtitle.value.trim()) {
        invalidateField(bannerSubtitle, subtitleError, defaultSubtitleErr);
    } else if (hasForbiddenChars(bannerSubtitle.value)) {
        invalidateField(bannerSubtitle, subtitleError, 'Използване на забранени символи!');
    } else {
        subtitleError.textContent = defaultSubtitleErr;
        subtitleError.classList.remove('red');
    }

    // --- Final Step ---
    if (!valid) {
        event.preventDefault();
        setGlobalMessage('Неуспешно създаване на ресурс', 'red');
    } else {
        setGlobalMessage('Ресурсът е създаден!', 'green');
    }
}

/**********************************************
  6) VALIDATION: Create Template Form
**********************************************/
function validateCreateTemplateForm(event) {
    const templateImage            = document.getElementById('templateImage');
    const templateAltAttribute     = document.getElementById('templateAltAttribute');
    const templateTitle            = document.getElementById('templateTitle');
    const templateShortDescription = document.getElementById('templateShortDescription');
    const previewLink              = document.getElementById('previewLink');

    // <p> after each field
    const imageError       = templateImage.nextElementSibling;
    const altError         = templateAltAttribute.nextElementSibling;
    const titleError       = templateTitle.nextElementSibling;
    const shortDescError   = templateShortDescription.nextElementSibling;
    const previewLinkError = previewLink.nextElementSibling;

    // Default texts
    const defaultImageErr     = imageError.textContent;
    const defaultAltErr       = altError.textContent;
    const defaultTitleErr     = titleError.textContent;
    const defaultShortDescErr = shortDescError.textContent;
    const defaultPreviewErr   = previewLinkError.textContent;

    let valid = true;

    function invalidateField(inputElem, errorElem, msg) {
        errorElem.textContent = msg;
        errorElem.classList.add('red');
        if (valid) {
            inputElem.focus();
        }
        valid = false;
    }

    // --- Template Image URL ---
    if (!templateImage.value.trim()) {
        invalidateField(templateImage, imageError, defaultImageErr);
    } else if (hasForbiddenChars(templateImage.value)) {
        invalidateField(templateImage, imageError, 'Използване на забранени символи!');
    } else {
        imageError.textContent = defaultImageErr;
        imageError.classList.remove('red');
    }

    // --- Template Alt Attribute ---
    if (!templateAltAttribute.value.trim()) {
        invalidateField(templateAltAttribute, altError, defaultAltErr);
    } else if (hasForbiddenChars(templateAltAttribute.value)) {
        invalidateField(templateAltAttribute, altError, 'Използване на забранени символи!');
    } else {
        altError.textContent = defaultAltErr;
        altError.classList.remove('red');
    }

    // --- Template Title ---
    if (!templateTitle.value.trim()) {
        invalidateField(templateTitle, titleError, defaultTitleErr);
    } else if (hasForbiddenChars(templateTitle.value)) {
        invalidateField(templateTitle, titleError, 'Използване на забранени символи!');
    } else {
        titleError.textContent = defaultTitleErr;
        titleError.classList.remove('red');
    }

    // --- Template Short Description (10 to 50 chars) ---
    if (!templateShortDescription.value.trim()) {
        invalidateField(templateShortDescription, shortDescError, defaultShortDescErr);
    } else if (hasForbiddenChars(templateShortDescription.value)) {
        invalidateField(templateShortDescription, shortDescError, 'Използване на забранени символи!');
    } else if (
        templateShortDescription.value.length < 10 ||
        templateShortDescription.value.length > 50
    ) {
        invalidateField(templateShortDescription, shortDescError, defaultShortDescErr);
    } else {
        shortDescError.textContent = defaultShortDescErr;
        shortDescError.classList.remove('red');
    }

    // --- Preview Link ---
    if (!previewLink.value.trim()) {
        invalidateField(previewLink, previewLinkError, defaultPreviewErr);
    } else if (hasForbiddenChars(previewLink.value)) {
        invalidateField(previewLink, previewLinkError, 'Използване на забранени символи!');
    } else {
        previewLinkError.textContent = defaultPreviewErr;
        previewLinkError.classList.remove('red');
    }

    // --- Final Step ---
    if (!valid) {
        event.preventDefault();
        setGlobalMessage('Неуспешно създаване на ресурс', 'red');
    } else {
        setGlobalMessage('Ресурсът е създаден!', 'green');
    }
}

/**********************************************
  7) ATTACH VALIDATION IF FORMS EXIST
**********************************************/
window.onload = function () {
    // CONTACT FORM
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', validateContactForm);
    }

    // CREATE ARTICLE
    const createArticleForm = document.getElementById('createArticleForm');
    if (createArticleForm) {
        createArticleForm.addEventListener('submit', validateCreateArticleForm);
    }

    // CREATE BANNER
    const createBannerForm = document.getElementById('createBannerForm');
    if (createBannerForm) {
        createBannerForm.addEventListener('submit', validateCreateBannerForm);
    }

    // CREATE TEMPLATE
    const createTemplateForm = document.getElementById('createTemplateForm');
    if (createTemplateForm) {
        createTemplateForm.addEventListener('submit', validateCreateTemplateForm);
    }

    // If you still use focusField logic (like for contact form), keep it:
    const focusField = document.getElementById('focusField');
    if (focusField) {
        const fieldId = focusField.value;
        if (fieldId) {
            const fieldToFocus = document.getElementById(fieldId);
            if (fieldToFocus) {
                fieldToFocus.focus();
            }
        }
    }
};
