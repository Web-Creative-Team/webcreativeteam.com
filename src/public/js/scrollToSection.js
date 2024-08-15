document.addEventListener('DOMContentLoaded', function() {
    const serviceLinks = document.querySelectorAll('[data-target="#sectionServices"]');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('data-target'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const serviceLinks = document.querySelectorAll('[data-target="#sectionOurTeam"]');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('data-target'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
