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



/*======= Valideción formulario =======*/
/* ==== Función para mostrar mensaje de éxito ==== */
function mostrarMensajeExito() {
    spinnerAnimation.classList.add('hidden');
    form.reset();

    spinnerText.classList.remove('hidden');
    spinnerText.textContent = "¡Gracias por contactarnos! Tus datos han sido enviados.";

    setTimeout(() => {
        spinnerText.classList.add('hidden');
        spinner.classList.add('hidden');
    }, 3000);
}

/* ==== Función para mostrar mensaje de error ==== */
function mostrarMensajeError() {
    spinnerAnimation.classList.add('hidden'); // Oculta la animación del spinner

    spinnerText.classList.remove('hidden'); // Muestra el texto del spinner
    spinnerText.textContent = "Ocurrió un error al enviar los datos. Por favor, inténtalo de nuevo.";
    spinnerText.style.backgroundColor = "#dc2626"; // Cambia el fondo del mensaje a rojo
    spinnerText.style.color = "white"; // Asegura que el texto sea legible con contraste

    setTimeout(() => {
        spinnerText.classList.add('hidden'); // Oculta el mensaje después de 3 segundos
        spinner.classList.add('hidden'); // Oculta el spinner completo
        spinnerText.style.backgroundColor = ""; // Resetea el fondo del mensaje
        spinnerText.style.color = ""; // Resetea el color del texto
    }, 3000);
}


/* ==== Cambiar idioma ingles - español ==== */



/*======= Actualizar año footer =======*/
document.getElementById("year").textContent = new Date().getFullYear();