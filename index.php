<?php require __DIR__ . '/includes/layout.php'; render_header('Home'); ?>
<header class="hero">
  <div class="hero-copy">
    <span class="eyebrow">25% advance booking plan available</span>
    <h1>Engineered for the modern traveler.</h1>
    <p>Real-time travel enquiries, dynamic package pricing, hotel discovery and Hostinger-ready PHP booking management.</p>
    <form class="search-card" action="packages.php" method="get">
      <label><span>Destination</span><input name="destination" placeholder="Where to?"></label>
      <label><span>Travel date</span><input type="date" name="date"></label>
      <label><span>Travelers</span><select name="adults"><option>2</option><option>1</option><option>3</option><option>4</option></select></label>
      <button class="btn btn-dark" type="submit">Search</button>
    </form>
  </div>
</header>
<main class="container">
  <div class="section-title"><div><h2>Curated expeditions</h2><p id="packageCount">Loading packages...</p></div><a href="packages.php" class="btn btn-light">View all</a></div>
  <div class="tabs" data-tabs="home-packages"><button data-filter="all" class="active">Featured</button><button data-filter="Domestic">Domestic</button><button data-filter="International">International</button></div>
  <div class="card-grid" id="featuredPackages"></div>
  <section class="stats-grid">
    <article><strong>98%</strong><span>CSAT score from verified travelers.</span></article>
    <article><strong>72%</strong><span>Peak-season inventory utilization.</span></article>
    <article><strong>GST</strong><span>Compliant invoices and booking records.</span></article>
  </section>
  <section class="split-panel">
    <div><h2>Need a custom trip?</h2><p>Share your destination, dates and budget. The backend stores the lead in MySQL for follow-up from your admin panel.</p></div>
    <form class="lead-form" data-lead-form>
      <input name="customer_name" placeholder="Your name" required>
      <input type="email" name="customer_email" placeholder="Email" required>
      <input name="customer_phone" placeholder="Phone" required>
      <textarea name="enquiry_details" placeholder="Tell us what you need"></textarea>
      <button class="btn btn-primary" type="submit">Send enquiry</button>
      <p class="form-message"></p>
    </form>
  </section>
</main>
<?php render_footer(); ?>
