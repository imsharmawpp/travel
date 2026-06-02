# NeoTravel PHP Travel Portal

A complete Hostinger-ready travel booking project using:

- **Frontend:** HTML, CSS and vanilla JavaScript
- **Backend:** PHP 8+ with PDO
- **Database:** MySQL / MariaDB

## Main features

- Home page with package search, featured packages and lead capture.
- Packages listing, package detail pages and booking flow.
- Hotels listing, hotel detail pages and booking flow.
- Coupon validation and partial/advance payment recording.
- Account booking lookup by customer email.
- Admin dashboard for recent bookings, leads and adding packages.
- JSON API under `api/index.php`.

## Hostinger upload steps

1. Create a MySQL database in Hostinger hPanel.
2. Open phpMyAdmin and import `database/schema.sql`.
3. Update database values in `includes/config.php`:
   - `db_host`
   - `db_name`
   - `db_user`
   - `db_pass`
4. Upload all project files to `public_html`.
5. Visit your domain. The default page is `index.php`.

## Local testing

If PHP is installed locally:

```bash
php -S localhost:8000
```

Then open `http://localhost:8000`.

## API examples

- `GET api/index.php/packages`
- `GET api/index.php/packages/kashmir-premium-escape`
- `GET api/index.php/hotels`
- `POST api/index.php/bookings`
- `GET api/index.php/dashboard`

## Notes

The project intentionally avoids Node.js, React build steps and server-side frameworks so it can be uploaded directly to typical shared Hostinger PHP hosting.
