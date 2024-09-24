document.getElementById('createArticleForm').onsubmit = function (event) {
    // Get form inputs and associated error messages
    const articleTitle = document.getElementById('articleTitle');
    const articleImage = document.getElementById('articleImage');
    const articleContent = document.getElementById('articleContent');
    const articleMetaTitle = document.getElementById('articleMetaTitle');
    const articleMetaDescription = document.getElementById('articleMetaDescription');

    // Get the <p> tags after each input field
    const titleError = articleTitle.nextElementSibling;
    const imageError = articleImage.nextElementSibling;
    const contentError = articleContent.nextElementSibling;
    const metaTitleError = articleMetaTitle.nextElementSibling;
    const metaDescriptionError = articleMetaDescription.nextElementSibling;

    // Assume the form is valid
    let valid = true;

    // Global notification container for forbidden symbols or missing fields
    const globalMessageContainer = document.querySelector('.messageContainer');

    // Forbidden symbols pattern
    const forbiddenPattern = /[<>\/\\]/;

    // Reset global message
    globalMessageContainer.innerHTML = '';
    globalMessageContainer.classList.remove('red', 'green');

    // Check for forbidden symbols in all fields
    if (forbiddenPattern.test(articleTitle.value) || forbiddenPattern.test(articleImage.value) || forbiddenPattern.test(articleContent.value) || forbiddenPattern.test(articleMetaTitle.value) || forbiddenPattern.test(articleMetaDescription.value)) {
        globalMessageContainer.innerHTML = '<p class="messageText red">Използване на забранени символи!</p>';
        globalMessageContainer.classList.add('red');
        event.preventDefault(); // Prevent form submission
        return; // Stop further validation
    }

    // Validate title
    if (!articleTitle.value || articleTitle.value.length < 2) {
        titleError.classList.add('red');
        if (valid) articleTitle.focus();
        valid = false;
    } else {
        titleError.classList.remove('red');
    }

    // Validate image
    if (!articleImage.value) {
        imageError.classList.add('red');
        if (valid) articleImage.focus();
        valid = false;
    } else {
        imageError.classList.remove('red');
    }

    // Validate content
    if (!articleContent.value || articleContent.value.length < 10) {
        contentError.classList.add('red');
        if (valid) articleContent.focus();
        valid = false;
    } else {
        contentError.classList.remove('red');
    }

    // Validate meta title
    if (!articleMetaTitle.value || articleMetaTitle.value.length > 55) {
        metaTitleError.classList.add('red');
        if (valid) articleMetaTitle.focus();
        valid = false;
    } else {
        metaTitleError.classList.remove('red');
    }

    // Validate meta description
    if (!articleMetaDescription.value || articleMetaDescription.value.length > 136) {
        metaDescriptionError.classList.add('red');
        if (valid) articleMetaDescription.focus();
        valid = false;
    } else {
        metaDescriptionError.classList.remove('red');
    }

    // If any validation fails, prevent form submission and show global message
    if (!valid) {
        globalMessageContainer.innerHTML = '<p class="messageText red">Моля попълнете всички задължителни полета</p>';
        globalMessageContainer.classList.add('red');
        event.preventDefault();
    }
};
