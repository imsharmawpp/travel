<?php require __DIR__ . '/includes/layout.php'; render_header('Hotels'); ?>
<main class="container page-pad">
  <div class="section-title"><div><h1>Hotels</h1><p>Browse hotels and room prices from MySQL.</p></div></div>
  <form class="filter-bar" id="hotelFilters"><input name="search" placeholder="Search hotel or city"><select name="stars"><option value="">Any stars</option><option value="5">5 star</option><option value="4">4 star</option><option value="3">3 star</option></select><button class="btn btn-primary">Search</button></form>
  <div class="card-grid" id="hotelsGrid"></div>
</main>
<?php render_footer(); ?>
