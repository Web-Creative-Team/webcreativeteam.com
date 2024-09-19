document.getElementById('contactForm').onsubmit = function (event) {
    // Get form inputs and associated error messages
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');

    const nameError = nameInput.nextElementSibling;  // The <p> after the input field
    const emailError = emailInput.nextElementSibling; // The <p> after the input field
    const messageError = messageTextarea.nextElementSibling; // The <p> after the textarea

    // Assume the form is valid
    let valid = true;

    // Forbidden symbols (like <>, /, \, etc.)
    const forbiddenPattern = /[<>\/\\]/;

    // Check if forbidden symbols are used
    if (forbiddenPattern.test(nameInput.value) || forbiddenPattern.test(emailInput.value) || forbiddenPattern.test(messageTextarea.value)) {
        // Show global notification instead of alert
        const globalMessageContainer = document.querySelector('.messageContainer');
        globalMessageContainer.innerHTML = '<p class="messageText red">Използване на забранени символи!</p>';
        globalMessageContainer.classList.add('red');
        
        event.preventDefault();
        return;  // Stop further validation
    }

    // Name validation: must contain only alphabetic characters and be at least 2 characters
    const namePattern = /^[a-zA-Z\s]+$/; // Alphabetic characters and spaces
    if (!nameInput.value || nameInput.value.length < 2 || !namePattern.test(nameInput.value)) {
        nameError.classList.add('red');
        nameInput.focus();
        valid = false;
    } else {
        nameError.classList.remove('red');
    }

    // Email validation: must follow the correct email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    if (!emailInput.value || !emailPattern.test(emailInput.value)) {
        emailError.classList.add('red');
        if (valid) {
            emailInput.focus();
        }
        valid = false;
    } else {
        emailError.classList.remove('red');
    }

    // Message validation: must be between 10 and 1000 characters
    if (!messageTextarea.value || messageTextarea.value.length < 10 || messageTextarea.value.length > 1000) {
        messageError.classList.add('red');
        if (valid) {
            messageTextarea.focus();
        }
        valid = false;
    } else {
        messageError.classList.remove('red');
    }

    // If the form is invalid, prevent submission
    if (!valid) {
        event.preventDefault();
    }
};

window.onload = function () {
    const focusField = document.getElementById('focusField').value;

    // Focus on the field with the error
    if (focusField) {
        document.getElementById(focusField).focus();
    }
};
