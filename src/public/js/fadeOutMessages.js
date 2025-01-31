// public/js/fadeOutMessages.js

document.addEventListener('DOMContentLoaded', function() {
    // Select any .messageContainer that has either .green or .red
    const messageContainers = document.querySelectorAll('.messageContainer.green, .messageContainer.red');
  
    messageContainers.forEach(container => {
      // Wait 4 seconds, then fade it out
      setTimeout(() => {
        // Add the fade-out class to trigger our CSS animation
        container.classList.add('fade-out');
  
        // After the 1s animation finishes, remove the element
        setTimeout(() => {
          container.remove();
        }, 1000);
      }, 3000);
    });
  });
  