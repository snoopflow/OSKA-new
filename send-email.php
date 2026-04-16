<?php
if ($_POST) {
    // Get form data
    $firstName = htmlspecialchars($_POST['firstName']);
    $lastName = htmlspecialchars($_POST['lastName']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);
    $service = htmlspecialchars($_POST['service']);
    $message = htmlspecialchars($_POST['message']);
    
    // Email configuration
    $to = "info@oska.ng, support@oska.ng";
    $subject = "New Contact Form Submission from OSKA Website";
    
    // Email body
    $body = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
    </head>
    <body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> $firstName $lastName</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Service Interest:</strong> $service</p>
        <p><strong>Message:</strong></p>
        <p>$message</p>
        <hr>
        <p><em>This email was sent from the OSKA website contact form.</em></p>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@oska.ng" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Redirect to thank you page
        header("Location: thank-you.html");
        exit();
    } else {
        echo "Sorry, there was an error sending your message. Please try again.";
    }
} else {
    // Redirect if accessed directly
    header("Location: contact.html");
    exit();
}
?>