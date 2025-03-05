<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = strip_tags($_POST["nombre"]);
    $telefono = strip_tags($_POST["telefono"]);
    $cp = strip_tags($_POST["cp"]);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);

    // Validación de email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header('Location: /error.html');
        exit;
    }

    $fecha = date('d/m/Y', time());
    /* $ip = $_SERVER["REMOTE_ADDR"];
    $captcha = $_POST["g-recaptcha-response"];
    $secretkey = "secretkey"; */ // Cambia esto por tu secret key

    // Verificación de reCAPTCHA
    /* $respuesta = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretkey&response=$captcha&remoteip=$ip");
    $atributos = json_decode($respuesta, TRUE);   

    if (intval($atributos["success"]) !== 1) {
        header('Location: /error.html');
        exit;
    } */

    // Cuerpo del mensaje de correo
    $destinatario = "camoralesh27@gmail.com"; // Cambia esto por tu correo real
    $asunto = "NEW prospective customer from WARRIOR AC webpage!";
    $mensaje = "Nombre: $nombre\n";
    $mensaje .= "Teléfono: $telefono\n";
    $mensaje .= "Código Postal: $cp\n";
    $mensaje .= "Email: $email\n";
    $mensaje .= "Enviado el: $fecha\n";

    // Cabeceras para el correo
    $cabeceras = "From: $email\r\n";
    $cabeceras .= "Reply-To: $email\r\n";
    $cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($destinatario, $asunto, $mensaje, $cabeceras)) {
        header('Location: /succes.html');
    } else {
        header('Location: /error.html');
    }
} else {
    echo "Acceso no permitido.";
}
?>
