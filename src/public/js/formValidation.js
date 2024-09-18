document.getElementById('contactForm').onsubmit = function (event) {
    // Get form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');

    // Assume the form is valid
    let valid = true;

    // Check each field and focus on the first empty one
    if (!nameInput.value) {
        nameInput.focus();
        valid = false;
    } else if (!emailInput.value) {
        emailInput.focus();
        valid = false;
    } else if (!messageTextarea.value) {
        messageTextarea.focus();
        valid = false;
    }

    // If the form is invalid, prevent submission
    if (!valid) {
        event.preventDefault();
    }
};
