const {CAPTCHA_SITE_KEY, CAPTCHA_SECRET_SITE_KEY} = require('../../config/config');

grecaptcha.ready(function () {
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault();
        grecaptcha.execute(CAPTCHA_SITE_KEY, { action: 'submit' }).then(function (token) {
            // Add the token to a hidden field in the form or append it to the form data
            document.getElementById('recaptchaResponse').value = token;
            // Finally submit the form
            document.getElementById('contactForm').submit();
        });
    });
});