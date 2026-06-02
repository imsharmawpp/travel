<?php require __DIR__ . '/includes/layout.php'; render_header('My Account'); ?>
<main class="container page-pad">
  <h1>My bookings</h1><p class="muted">Enter the same email used for booking.</p>
  <form class="filter-bar" id="accountLookup"><input type="email" name="email" placeholder="you@example.com" required><button class="btn btn-primary">Find bookings</button></form>
  <div id="accountBookings" class="table-wrap"></div>
</main>
<?php render_footer(); ?>
