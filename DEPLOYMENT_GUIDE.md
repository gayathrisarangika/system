# Deployment Guide

This guide provides instructions for deploying the Publication Management System on an Apache server.

## Apache Configuration

The 404 error you encountered is likely due to Apache's `DocumentRoot` not pointing to the `public` directory of the Laravel application, or `AllowOverride` not being set to `All`.

### Recommended VirtualHost Configuration

Ensure your Apache VirtualHost configuration (e.g., in `/etc/apache2/sites-available/000-default.conf` or a custom `.conf` file) looks similar to this:

```apache
<VirtualHost *:443>
    ServerName 192.248.87.45
    DocumentRoot /path/to/your/project/public

    <Directory /path/to/your/project/public>
        AllowOverride All
        Require all granted
    </Directory>

    # SSL configuration (already exists on your server)
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

**Key Requirements:**
1.  **DocumentRoot:** Must point to the `public` directory of the project.
2.  **AllowOverride All:** This allows the `.htaccess` file inside the `public` directory to handle routing.
3.  **mod_rewrite:** Ensure the rewrite module is enabled: `sudo a2enmod rewrite` and then restart Apache `sudo systemctl restart apache2`.

---

## Directory Permissions

Laravel requires certain directories to be writable by the web server. Run the following commands from the project root:

```bash
# Set ownership to the web server user (commonly www-data on Ubuntu)
sudo chown -R www-data:www-data storage bootstrap/cache

# Set proper permissions
sudo chmod -R 775 storage bootstrap/cache
```

---

## Environment Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Generate the application key:
    ```bash
    php artisan key:generate
    ```
3.  Ensure your `.env` file is properly configured for the production environment:
    - `APP_ENV=production`
    - `APP_DEBUG=false`
    - `APP_URL=https://192.248.87.45` (or your domain name)
    - Configure your database settings (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
