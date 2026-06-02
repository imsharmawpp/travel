<?php require __DIR__ . '/includes/layout.php'; render_header('Confirmation'); ?>
<main class="container page-pad narrow"><div class="panel success"><h1>Booking confirmed</h1><p>Your booking reference is <strong><?= htmlspecialchars($_GET['id'] ?? '') ?></strong>.</p><a class="btn btn-primary" href="account.php">View booking</a></div></main>
<?php render_footer(); ?>
