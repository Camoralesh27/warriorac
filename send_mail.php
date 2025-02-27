<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST["nombre"]);
    $telefono = htmlspecialchars($_POST["telefono"]);
    $cp = htmlspecialchars($_POST["cp"]);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);

    // Validar que el correo sea válido
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Correo inválido.");
    }

    $destinatario = "camoralesh27@gmail.com"; // Cambia esto por tu correo real
    $asunto = "NEW prospective customer from WARRIOR AC webpage!";
    $mensaje = "Nombre: $nombre\n";
    $mensaje .= "Teléfono: $telefono\n";
    $mensaje .= "Código Postal: $cp\n";
    $mensaje .= "Email: $email\n";

    $cabeceras = "From: $email\r\n";
    $cabeceras .= "Reply-To: $email\r\n";

    if (mail($destinatario, $asunto, $mensaje, $cabeceras)) {
        echo "Mensaje enviado correctamente.";
    } else {
        echo "Error al enviar el mensaje.";
    }
} else {
    echo "Acceso no permitido.";
}
?>
