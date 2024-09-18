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

    // Check if name is valid
    if (!nameInput.value || nameInput.value.length < 2) {
        nameError.classList.add('red');
        nameInput.focus();
        valid = false;
    } else {
        nameError.classList.remove('red');
    }

    // Check if email is valid
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

    // Check if message is valid
    if (!messageTextarea.value || messageTextarea.value.length < 10) {
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
