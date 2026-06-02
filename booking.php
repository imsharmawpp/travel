<?php require __DIR__ . '/includes/layout.php'; render_header('Booking'); ?>
<main class="container page-pad narrow">
  <h1>Complete your booking</h1>
  <p class="muted">Pay a 25% advance or record the full amount. Connect your own payment gateway later if required.</p>
  <form id="bookingForm" class="panel form-stack">
    <input type="hidden" name="package_id" value="<?= htmlspecialchars($_GET['package_id'] ?? '') ?>">
    <input type="hidden" name="hotel_id" value="<?= htmlspecialchars($_GET['hotel_id'] ?? '') ?>">
    <label>Name<input name="customer_name" required></label>
    <label>Email<input type="email" name="customer_email" required></label>
    <label>Phone<input name="customer_phone" required></label>
    <label>Travel date<input type="date" name="travel_date" required></label>
    <div class="two-col"><label>Adults<input type="number" name="guests_adults" value="2" min="1"></label><label>Children<input type="number" name="guests_children" value="0" min="0"></label></div>
    <div class="two-col"><label>Total price<input type="number" name="total_price" value="<?= htmlspecialchars($_GET['price'] ?? '0') ?>" min="0" required></label><label>Amount paid<input type="number" name="amount_paid" value="0" min="0"></label></div>
    <label>Coupon code<div class="inline"><input name="coupon" placeholder="TRY: EARLY25"><button class="btn btn-light" type="button" id="applyCoupon">Apply</button></div></label>
    <label>Special requests<textarea name="special_requests"></textarea></label>
    <button class="btn btn-primary" type="submit">Confirm booking</button><p class="form-message"></p>
  </form>
</main>
<?php render_footer(); ?>
