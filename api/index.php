<?php
require_once __DIR__ . '/../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = trim($_SERVER['PATH_INFO'] ?? ($_GET['resource'] ?? ''), '/');
$parts = $path === '' ? [] : explode('/', $path);
$resource = $parts[0] ?? '';
$id = $parts[1] ?? null;

try {
    match ($resource) {
        'packages' => packages($method, $id),
        'hotels' => hotels($method, $id),
        'bookings' => bookings($method, $id),
        'coupons' => coupons($method),
        'leads' => leads($method),
        'payment-plans' => payment_plans($method),
        'dashboard' => dashboard($method),
        default => json_response(['error' => 'API route not found'], 404),
    };
} catch (Throwable $e) {
    json_response(['error' => 'Server error', 'message' => $e->getMessage()], 500);
}

function packages(string $method, ?string $slug): void
{
    $pdo = db();
    if ($method === 'GET' && $slug) {
        $stmt = $pdo->prepare('SELECT * FROM packages WHERE slug = ? OR id = ? LIMIT 1');
        $stmt->execute([$slug, ctype_digit($slug) ? (int)$slug : 0]);
        $package = $stmt->fetch();
        if (!$package) json_response(['error' => 'Package not found'], 404);
        $package['itinerary'] = fetch_all('SELECT * FROM itineraries WHERE package_id = ? ORDER BY day_number', [$package['id']]);
        $package['inclusions'] = fetch_all('SELECT * FROM inclusions WHERE package_id = ? AND is_included = 1', [$package['id']]);
        $package['exclusions'] = fetch_all('SELECT * FROM inclusions WHERE package_id = ? AND is_included = 0', [$package['id']]);
        $package['addons'] = fetch_all('SELECT * FROM addons WHERE package_id = ? AND is_active = 1', [$package['id']]);
        json_response($package);
    }
    if ($method === 'GET') {
        $where = ['is_active = 1'];
        $params = [];
        if (!empty($_GET['category'])) { $where[] = 'category = ?'; $params[] = $_GET['category']; }
        if (!empty($_GET['destination'])) { $where[] = 'destination LIKE ?'; $params[] = '%' . $_GET['destination'] . '%'; }
        $stmt = $pdo->prepare('SELECT * FROM packages WHERE ' . implode(' AND ', $where) . ' ORDER BY created_at DESC');
        $stmt->execute($params);
        json_response($stmt->fetchAll());
    }
    if ($method === 'POST') {
        $b = input_json();
        $slugValue = $b['slug'] ?? slugify($b['name'] ?? 'package');
        $stmt = $pdo->prepare('INSERT INTO packages (name, slug, package_code, destination, country, state, city, duration_days, duration_nights, starting_price, offer_price, package_type, category, banner_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$b['name'] ?? '', $slugValue, $b['package_code'] ?? strtoupper(substr($slugValue,0,6)), $b['destination'] ?? '', $b['country'] ?? '', $b['state'] ?? '', $b['city'] ?? '', $b['duration_days'] ?? 1, $b['duration_nights'] ?? 0, $b['starting_price'] ?? 0, $b['offer_price'] ?? null, $b['package_type'] ?? 'Holiday', $b['category'] ?? 'Domestic', $b['banner_url'] ?? null]);
        json_response(['id' => $pdo->lastInsertId(), 'slug' => $slugValue], 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
}

function hotels(string $method, ?string $id): void
{
    $pdo = db();
    if ($method === 'GET' && $id) {
        $stmt = $pdo->prepare('SELECT * FROM hotels WHERE id = ? LIMIT 1');
        $stmt->execute([(int)$id]);
        $hotel = $stmt->fetch();
        if (!$hotel) json_response(['error' => 'Hotel not found'], 404);
        $hotel['rooms'] = fetch_all('SELECT * FROM room_types WHERE hotel_id = ? ORDER BY base_price', [$hotel['id']]);
        json_response($hotel);
    }
    if ($method === 'GET') {
        $where = ['1=1']; $params = [];
        if (!empty($_GET['city'])) { $where[] = 'city LIKE ?'; $params[] = '%' . $_GET['city'] . '%'; }
        if (!empty($_GET['stars'])) { $where[] = 'star_rating = ?'; $params[] = (int)$_GET['stars']; }
        if (!empty($_GET['search'])) { $where[] = '(name LIKE ? OR city LIKE ? OR country LIKE ?)'; $term = '%' . $_GET['search'] . '%'; array_push($params, $term, $term, $term); }
        $sql = 'SELECT h.*, COUNT(rt.id) room_type_count, MIN(rt.base_price) min_room_price FROM hotels h LEFT JOIN room_types rt ON rt.hotel_id = h.id WHERE ' . implode(' AND ', $where) . ' GROUP BY h.id ORDER BY h.star_rating DESC, h.name';
        $stmt = $pdo->prepare($sql); $stmt->execute($params); json_response($stmt->fetchAll());
    }
    if ($method === 'POST') {
        $b = input_json();
        $stmt = $pdo->prepare('INSERT INTO hotels (name, property_code, star_rating, city, state, country, address, amenities, image_url) VALUES (?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$b['name'] ?? '', $b['property_code'] ?? '', $b['star_rating'] ?? 3, $b['city'] ?? '', $b['state'] ?? '', $b['country'] ?? '', $b['address'] ?? '', json_encode($b['amenities'] ?? []), $b['image_url'] ?? null]);
        json_response(['id' => $pdo->lastInsertId()], 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
}

function bookings(string $method, ?string $id): void
{
    $pdo = db();
    if ($method === 'GET' && $id) {
        $stmt = $pdo->prepare('SELECT b.*, p.name package_name, p.destination, h.name hotel_name FROM bookings b LEFT JOIN packages p ON b.package_id=p.id LEFT JOIN hotels h ON b.hotel_id=h.id WHERE b.booking_id = ? OR b.id = ? LIMIT 1');
        $stmt->execute([$id, ctype_digit($id) ? (int)$id : 0]); json_response($stmt->fetch() ?: ['error' => 'Booking not found'], $stmt->rowCount() ? 200 : 404);
    }
    if ($method === 'GET') {
        $params = []; $where = '1=1';
        if (!empty($_GET['email'])) { $where .= ' AND b.customer_email = ?'; $params[] = $_GET['email']; }
        $stmt = $pdo->prepare("SELECT b.*, p.name package_name, p.destination, h.name hotel_name FROM bookings b LEFT JOIN packages p ON b.package_id=p.id LEFT JOIN hotels h ON b.hotel_id=h.id WHERE {$where} ORDER BY b.created_at DESC LIMIT 100");
        $stmt->execute($params); json_response($stmt->fetchAll());
    }
    if ($method === 'POST') {
        $b = input_json(); $bookingId = 'BK' . date('YmdHis') . random_int(10, 99);
        $total = (float)($b['total_price'] ?? 0); $paid = (float)($b['amount_paid'] ?? 0);
        $payment = $paid >= $total ? 'paid' : ($paid > 0 ? 'partial' : 'pending');
        $stmt = $pdo->prepare('INSERT INTO bookings (booking_id, customer_name, customer_email, customer_phone, package_id, hotel_id, travel_date, guests_adults, guests_children, guests_infants, total_price, amount_paid, payment_status, special_requests) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$bookingId, $b['customer_name'] ?? '', $b['customer_email'] ?? '', $b['customer_phone'] ?? '', $b['package_id'] ?? null, $b['hotel_id'] ?? null, $b['travel_date'] ?? date('Y-m-d'), $b['guests_adults'] ?? 1, $b['guests_children'] ?? 0, $b['guests_infants'] ?? 0, $total, $paid, $payment, $b['special_requests'] ?? '']);
        json_response(['booking_id' => $bookingId, 'payment_status' => $payment], 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
}

function coupons(string $method): void
{
    if ($method !== 'POST') json_response(['error' => 'Method not allowed'], 405);
    $b = input_json(); $amount = (float)($b['booking_amount'] ?? 0);
    $stmt = db()->prepare('SELECT * FROM coupons WHERE UPPER(code)=UPPER(?) AND is_active=1 AND (valid_until IS NULL OR valid_until >= CURDATE()) AND min_booking_amount <= ? LIMIT 1');
    $stmt->execute([$b['code'] ?? '', $amount]); $coupon = $stmt->fetch();
    if (!$coupon) json_response(['error' => 'Invalid or expired coupon code'], 400);
    $discount = $coupon['discount_type'] === 'percentage' ? $amount * ((float)$coupon['discount_value'] / 100) : (float)$coupon['discount_value'];
    if ($coupon['max_discount']) $discount = min($discount, (float)$coupon['max_discount']);
    json_response(['coupon' => $coupon, 'discount' => round($discount)]);
}

function leads(string $method): void
{
    if ($method === 'GET') json_response(fetch_all('SELECT * FROM leads ORDER BY created_at DESC'));
    if ($method === 'POST') {
        $b = input_json();
        $stmt = db()->prepare('INSERT INTO leads (customer_name, customer_email, customer_phone, source, enquiry_details) VALUES (?,?,?,?,?)');
        $stmt->execute([$b['customer_name'] ?? '', $b['customer_email'] ?? '', $b['customer_phone'] ?? '', $b['source'] ?? 'website', $b['enquiry_details'] ?? '']);
        json_response(['id' => db()->lastInsertId()], 201);
    }
    json_response(['error' => 'Method not allowed'], 405);
}

function payment_plans(string $method): void
{
    if ($method !== 'GET') json_response(['error' => 'Method not allowed'], 405);
    json_response(fetch_all('SELECT * FROM payment_plans WHERE is_active = 1 ORDER BY advance_percentage'));
}

function dashboard(string $method): void
{
    if ($method !== 'GET') json_response(['error' => 'Method not allowed'], 405);
    $pdo = db();
    json_response([
        'stats' => [
            'total_bookings' => (int)$pdo->query('SELECT COUNT(*) FROM bookings')->fetchColumn(),
            'total_revenue' => (float)$pdo->query('SELECT COALESCE(SUM(total_price),0) FROM bookings')->fetchColumn(),
            'amount_collected' => (float)$pdo->query('SELECT COALESCE(SUM(amount_paid),0) FROM bookings')->fetchColumn(),
            'total_leads' => (int)$pdo->query('SELECT COUNT(*) FROM leads')->fetchColumn(),
            'active_packages' => (int)$pdo->query('SELECT COUNT(*) FROM packages WHERE is_active=1')->fetchColumn(),
        ],
        'recentBookings' => fetch_all('SELECT b.*, p.name package_name FROM bookings b LEFT JOIN packages p ON b.package_id=p.id ORDER BY b.created_at DESC LIMIT 8'),
        'leads' => fetch_all('SELECT * FROM leads ORDER BY created_at DESC LIMIT 8'),
    ]);
}

function fetch_all(string $sql, array $params = []): array { $stmt = db()->prepare($sql); $stmt->execute($params); return $stmt->fetchAll(); }
function slugify(string $text): string { $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text), '-')); return $slug ?: 'package-' . time(); }
