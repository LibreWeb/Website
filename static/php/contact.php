<?php
// Set the e-mail address that submission should be sent to.
$address = base64_decode('aW5mb0BsaWJyZXdlYi5vcmc=');

// Set the e-mail subject prefix.
$prefix = 'Contact Form LibreWeb';

// DO NOT EDIT ANYTHING BELOW UNLESS YOU KNOW WHAT YOU ARE DOING.

$error = false;
$success = false;

// Check that the submission address is valid.
if ((bool) filter_var(trim($address), FILTER_VALIDATE_EMAIL)) {
  // Also set sender/return path header to this address to avoid SPF errors.
  $to = $sender = trim($address);
}
else {
  $error = true;
}

// Check that this is a post request.
if ($_SERVER['REQUEST_METHOD'] != 'POST' || empty($_POST)) {
  $error = true;
}

// Check if fake url field is filled in, i.e. spam bot.
if (!empty($_POST['url'])) {
  $error = true;
}

// Check that e-mail address is valid.
if ((bool) filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL)) {
  $email = trim($_POST['email']);
}
else {
  $error = true;
}

$secret_captcha = base64_decode('MHhBNzI5ZTY5QTUwMmUyRTg1MTI3QjE3ZDRDNzYyYzhGODAxYTlFOWU4');

$data = array(
  'secret' => $secret_captcha,
  'response' => $_POST['h-captcha-response']
);
$verify = curl_init();
curl_setopt($verify, CURLOPT_URL, "https://hcaptcha.com/siteverify");
curl_setopt($verify, CURLOPT_POST, true);
curl_setopt($verify, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($verify, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($verify);
// var_dump($response);
$responseData = json_decode($response);
if($responseData->success) {
  // Continue ...
} 
else {
  $error = true;
}

if (!$error) {
  // Construct the mail with headers.
  $name = _contact_clean_str($_POST['name'], ENT_QUOTES, true, true);
  $prefix = _contact_clean_str($prefix, ENT_NOQUOTES, true, true);
  $subject = _contact_clean_str($_POST['subject'], ENT_NOQUOTES, true, true);
  $subject = "[$prefix] $subject (from: $name)";
  $message = _contact_clean_str($_POST['message'], ENT_NOQUOTES);
  $lines = explode("\n", $message);
  array_walk($lines, '_contact_ff_wrap');
  $message = implode("\n", $lines);
  $headers = [
    'From'                      => "$name <$email>",
    'Reply-To'                  => $email,
    'Sender'                    => $sender,
    'Return-Path'               => $sender,
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'text/plain; charset=UTF-8; format=flowed; delsp=yes',
    'Content-Transfer-Encoding' => '8Bit',
    'X-Mailer'                  => 'PHP/' . phpversion(),
  ];
  $mime_headers = [];
  foreach ($headers as $key => $value) {
    $mime_headers[] = "$key: $value";
  }
  $mail_headers = join("\r\n", $mime_headers);

  // Send the mail, suppressing errors and setting Return-Path with the "-f" option.
  $success = @mail($to, $subject, $message, $mail_headers, '-f' . $sender);
}

$status = $success ? 'submitted' : 'error';

// Redirect back to contact form with status.
header('Location: https://libreweb.org/?' . $status . "#fh5co-contact", TRUE, 302);
exit;

function _contact_ff_wrap(&$line) {
  $line = wordwrap($line, 72, " \n");
}

function _contact_clean_str($str, $quotes, $strip = false, $encode = false) {
  if ($strip) {
    $str = strip_tags($str);
  }

  $str = htmlspecialchars(trim($str), $quotes, 'UTF-8');

  if ($encode && preg_match('/[^\x20-\x7E]/', $str)) {
    $str = '=?UTF-8?B?' . base64_encode($str) . '?=';
  }

  return $str;
}
