<?php
function render_header(string $title = 'NeoTravel'): void
{
    $config = require __DIR__ . '/config.php';
    $app = htmlspecialchars($config['app_name'], ENT_QUOTES, 'UTF-8');
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    echo <<<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle} | {$app}</title>
  <meta name="description" content="Book premium holiday packages and hotels with NeoTravel.">
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <nav class="nav">
    <a class="brand" href="index.php"><span class="brand-icon">✈</span><span>{$app}</span></a>
    <button class="nav-toggle" aria-label="Open menu">☰</button>
    <div class="nav-links">
      <a href="index.php">Home</a>
      <a href="packages.php">Packages</a>
      <a href="hotels.php">Hotels</a>
      <a href="account.php">My Account</a>
      <a href="admin.php">Admin</a>
      <a class="btn btn-primary" href="packages.php">Book Now</a>
    </div>
  </nav>
HTML;
}

function render_footer(): void
{
    $year = date('Y');
    echo <<<HTML
  <footer class="footer">
    <div>
      <a class="brand" href="index.php"><span class="brand-icon">✈</span><span>NeoTravel</span></a>
      <p>A Hostinger-ready PHP travel portal with HTML, CSS and JavaScript frontend.</p>
    </div>
    <div class="footer-grid">
      <a href="packages.php">Packages</a>
      <a href="hotels.php">Hotels</a>
      <a href="booking.php">Booking</a>
      <a href="admin.php">Admin</a>
    </div>
    <small>© {$year} NeoTravel. All rights reserved.</small>
  </footer>
  <script src="assets/js/app.js"></script>
</body>
</html>
HTML;
}
