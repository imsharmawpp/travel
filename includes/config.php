<?php
/**
 * Hostinger deployment configuration.
 *
 * 1. Create a MySQL database in hPanel.
 * 2. Import database/schema.sql with phpMyAdmin.
 * 3. Update the values below or set matching environment variables.
 */
return [
    'db_host' => getenv('DB_HOST') ?: 'localhost',
    'db_name' => getenv('DB_NAME') ?: 'travel_portal',
    'db_user' => getenv('DB_USER') ?: 'root',
    'db_pass' => getenv('DB_PASS') ?: '',
    'app_name' => 'NeoTravel',
    'admin_email' => getenv('ADMIN_EMAIL') ?: 'admin@example.com',
];
