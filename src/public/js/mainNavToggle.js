document.addEventListener("DOMContentLoaded", function () {
    const servicesMenu = document.querySelector(".nav-item > .nav-link[href='/#sectionServices']");
    const parentNavItem = servicesMenu.closest(".nav-item");
    const submenu = parentNavItem.querySelector(".servicesSubMenu");

    // Handle Mobile Submenu Clicks
    servicesMenu.addEventListener("click", function (event) {
        if (window.innerWidth <= 992) { // Mobile only
            event.preventDefault(); // Prevent jumping to #sectionServices
            parentNavItem.classList.toggle("show");

            // Toggle submenu visibility
            if (parentNavItem.classList.contains("show")) {
                submenu.style.display = "block";
            } else {
                submenu.style.display = "none";
            }
        }
    });

    // Close submenu when clicking outside (only on mobile)
    document.addEventListener("click", function (event) {
        if (!parentNavItem.contains(event.target) && window.innerWidth <= 992) {
            parentNavItem.classList.remove("show");
            submenu.style.display = "none"; // Hide submenu
        }
    });

    // Close submenu when selecting a submenu item (only on mobile)
    submenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 992) {
                parentNavItem.classList.remove("show");
                submenu.style.display = "none";
            }
        });
    });
});
