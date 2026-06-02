<?php require __DIR__ . '/includes/layout.php'; render_header('Package Details'); ?>
<main class="container page-pad"><div id="packageDetail" data-slug="<?= htmlspecialchars($_GET['slug'] ?? '') ?>"></div></main>
<?php render_footer(); ?>
