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




/*======= TIMER EN BOTON DE DESCARGA PDF =======*/
document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".catalogo__boton");

    botones.forEach(boton => {
        boton.addEventListener("click", function () {

            // Deshabilitar el botón y cambiar el texto
            boton.disabled = true;
            boton.classList.add("catalogo__boton--disabled");
            boton.textContent = "Espera 15s...";

            // Reactivar el botón después de 5 segundos
            setTimeout(() => {
                boton.disabled = false;
                boton.classList.remove("catalogo__boton--disabled");
                boton.textContent = "Descargar Catálogo📥";
            }, 15000);
        });
    });
});

/*======= Actualizar año footer =======*/
document.getElementById("year").textContent = new Date().getFullYear();