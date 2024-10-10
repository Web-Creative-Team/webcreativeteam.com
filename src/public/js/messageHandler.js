window.onload = function () {
    const messageContainers = document.querySelectorAll('.messageContainer');
    messageContainers.forEach((messageContainer) => {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 4000); // 4000 milliseconds = 4 seconds
    });
};
