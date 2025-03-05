/*======= SHOW MENU =======*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId);

    toggle.addEventListener('click', () => {
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu');
        // Add show-icon to show and hide menu icon
        toggle.classList.toggle('show-icon');
    });

    // Close menu when clicking on any nav link
    const navLinks = document.querySelectorAll(`#${navId} .navM__link`);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show-menu');
            toggle.classList.remove('show-icon');
        });
    });
};

showMenu('navM-toggle', 'navM-menu');


/* ==== Cambiar idioma ingles - español ==== */



/*======= Actualizar año footer =======*/
document.getElementById("year").textContent = new Date().getFullYear();