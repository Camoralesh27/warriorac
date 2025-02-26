<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $telefono = $_POST["telefono"];
    $cp = $_POST["cp"];
    $email = $_POST["email"];
    $captcha = $_POST["g-recaptcha-response"];

    // Verificar si se completó el reCAPTCHA
    if (!$captcha) {
        die("Error: Por favor verifica el reCAPTCHA.");
    }

    // Validar el reCAPTCHA con Google
    $secretKey = "6LcGu-MqAAAAAA1dxua8TcROGRVBUxOa2KUycuio";
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($response, true);

    if (!$responseKeys["success"]) {
        die("Error: No se pudo verificar el reCAPTCHA.");
    }

    // Si pasó el reCAPTCHA, enviar el correo
    $destinatario = "tu-correo@tu-dominio.com"; // Cambia esto
    $asunto = "Nuevo contacto desde la web";

    $mensaje = "Nombre: $nombre\n";
    $mensaje .= "Teléfono: $telefono\n";
    $mensaje .= "Código Postal: $cp\n";
    $mensaje .= "Email: $email\n";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($destinatario, $asunto, $mensaje, $headers)) {
        echo "Correo enviado correctamente.";
    } else {
        echo "Error al enviar el correo.";
    }
} else {
    echo "Acceso denegado.";
}
?>
