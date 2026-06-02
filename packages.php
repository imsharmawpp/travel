<?php require __DIR__ . '/includes/layout.php'; render_header('Packages'); ?>
<main class="container page-pad">
  <div class="section-title"><div><h1>Holiday packages</h1><p>Filter and book active packages from the PHP API.</p></div></div>
  <form class="filter-bar" id="packageFilters">
    <input name="destination" placeholder="Destination" value="<?= htmlspecialchars($_GET['destination'] ?? '') ?>">
    <select name="category"><option value="">All categories</option><option>Domestic</option><option>International</option></select>
    <button class="btn btn-primary">Apply filters</button>
  </form>
  <div class="card-grid" id="packagesGrid"></div>
</main>
<?php render_footer(); ?>
