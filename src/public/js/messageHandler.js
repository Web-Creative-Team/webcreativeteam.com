window.onload = function () {
    const messageContainer = document.querySelector('.messageContainer');
    if (messageContainer) {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // 3000 milliseconds = 3 seconds
    }
};