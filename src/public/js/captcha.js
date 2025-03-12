function onSubmit(token) {
    console.log("Generated reCAPTCHA token:", token);

    const form = document.getElementById("contactForm");
    if (!form) {
        console.error("ERROR: contactForm not found!");
        return;
    }

    // Добавяме токена директно към формата
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "recaptchaToken";
    hiddenInput.value = token;
    form.appendChild(hiddenInput);

    console.log("Form is being submitted with reCAPTCHA token.");
    form.submit();
}
