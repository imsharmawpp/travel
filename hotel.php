<?php require __DIR__ . '/includes/layout.php'; render_header('Hotel Details'); ?>
<main class="container page-pad"><div id="hotelDetail" data-id="<?= htmlspecialchars($_GET['id'] ?? '') ?>"></div></main>
<?php render_footer(); ?>
