<?php require __DIR__ . '/includes/layout.php'; render_header('Admin'); ?>
<main class="container page-pad">
  <div class="section-title"><div><h1>Admin dashboard</h1><p>Manage leads, bookings, packages and hotels through the PHP API.</p></div></div>
  <div class="stats-grid" id="adminStats"></div>
  <section class="panel"><h2>Recent bookings</h2><div id="adminBookings" class="table-wrap"></div></section>
  <section class="panel"><h2>Recent leads</h2><div id="adminLeads" class="table-wrap"></div></section>
  <section class="panel"><h2>Add package</h2><form id="adminPackageForm" class="form-stack"><input name="name" placeholder="Package name" required><input name="destination" placeholder="Destination" required><input name="country" placeholder="Country"><input name="starting_price" type="number" placeholder="Starting price" required><input name="offer_price" type="number" placeholder="Offer price"><select name="category"><option>Domestic</option><option>International</option></select><input name="banner_url" placeholder="Image URL"><button class="btn btn-primary">Save package</button><p class="form-message"></p></form></section>
</main>
<?php render_footer(); ?>
