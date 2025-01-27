document.getElementById('contactForm').onsubmit = function (event) {
    // Get all form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Get the <p> right after each field (the default help/error text)
    const nameError    = nameInput.nextElementSibling;
    const emailError   = emailInput.nextElementSibling;
    const phoneError   = phoneInput.nextElementSibling;
    const messageError = messageInput.nextElementSibling;

    // Keep the original help text so we can restore it if the field is valid
    const defaultNameError    = nameError.textContent;
    const defaultEmailError   = emailError.textContent;
    const defaultPhoneError   = phoneError.textContent;
    const defaultMessageError = messageError.textContent;

    // Assume form is valid unless a field check fails
    let valid = true;

    // Forbid < or > anywhere in the input (common for blocking HTML/script tags)
    const forbiddenPattern = /[<>]/;

    // Helper to mark a field invalid with a custom message
    function invalidateField(inputElem, errorElem, message) {
        errorElem.textContent = message;
        errorElem.classList.add('red');
        if (valid) {
            // Focus the first invalid field we encounter
            inputElem.focus();
        }
        valid = false;
    }

    // ------------ NAME FIELD VALIDATION ------------
    if (forbiddenPattern.test(nameInput.value)) {
        invalidateField(nameInput, nameError, 'Използване на забранени символи');
    } else {
        // Must be at least 2 chars, only letters/spaces
        const namePattern = /^[a-zA-Z\s]+$/;
        if (!nameInput.value || nameInput.value.length < 2 || !namePattern.test(nameInput.value)) {
            invalidateField(nameInput, nameError, 'Името трябва да съдържа поне 2 символа');
        } else {
            // Valid: restore the default text & remove red
            nameError.textContent = defaultNameError;
            nameError.classList.remove('red');
        }
    }

    // ------------ EMAIL FIELD VALIDATION ------------
    if (forbiddenPattern.test(emailInput.value)) {
        invalidateField(emailInput, emailError, 'Използване на забранени символи');
    } else {
        // Must follow a valid email pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value || !emailPattern.test(emailInput.value)) {
            invalidateField(emailInput, emailError, 'Моля въведете валиден Email адрес');
        } else {
            emailError.textContent = defaultEmailError;
            emailError.classList.remove('red');
        }
    }

    // ------------ PHONE FIELD VALIDATION (Optional) ------------
    if (forbiddenPattern.test(phoneInput.value)) {
        invalidateField(phoneInput, phoneError, 'Използване на забранени символи');
    } else {
        // Assuming phone is optional & no length checks
        phoneError.textContent = defaultPhoneError;
        phoneError.classList.remove('red');
    }

    // ------------ MESSAGE FIELD VALIDATION ------------
    if (forbiddenPattern.test(messageInput.value)) {
        invalidateField(messageInput, messageError, 'Използване на забранени символи');
    } else {
        // Must be 10-1000 characters
        if (!messageInput.value || messageInput.value.length < 10 || messageInput.value.length > 1000) {
            invalidateField(messageInput, messageError, 'Съобщението ви трябва да съдържа поне 10 символа');
        } else {
            messageError.textContent = defaultMessageError;
            messageError.classList.remove('red');
        }
    }

    // If any field was invalid, stop the form submission
    if (!valid) {
        event.preventDefault();
    }
};

// Keep your existing onload/focus logic
window.onload = function () {
    const focusField = document.getElementById('focusField').value;
    if (focusField) {
        document.getElementById(focusField).focus();
    }
};
