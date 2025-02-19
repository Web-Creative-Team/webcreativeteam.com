document.addEventListener("DOMContentLoaded", function () {
    const submenu = document.querySelector(".servicesSubMenu");
    const submenuLinks = submenu.querySelectorAll("a");

    // Ensure submenu is properly hidden on page load
    submenu.style.opacity = "0";
    submenu.style.visibility = "hidden";

    submenuLinks.forEach(link => {
        link.addEventListener("click", function () {
            submenu.style.opacity = "0";
            submenu.style.visibility = "hidden";
        });
    });

    document.addEventListener("click", function (event) {
        const isClickInside = submenu.parentElement.contains(event.target);
        if (!isClickInside) {
            submenu.style.opacity = "0";
            submenu.style.visibility = "hidden";
        }
    });

    submenu.parentElement.addEventListener("mouseenter", function () {
        submenu.style.opacity = "1";
        submenu.style.visibility = "visible";
    });

    submenu.parentElement.addEventListener("mouseleave", function () {
        submenu.style.opacity = "0";
        submenu.style.visibility = "hidden";
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".mainNav .nav-link");

    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.parentElement.classList.add("active");
        }
    });
});
