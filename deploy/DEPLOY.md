# Deploy Indus Trend to the VPS

The production document root is `/srv/industrend/app/dist`.

## Build on the server

As `serveradmin`, place this project in `/srv/industrend/app`, then run:

```bash
sudo chown -R industrend:industrend /srv/industrend/app
sudo -iu industrend
cd /srv/industrend/app
npm ci
npm run build
exit
```

## Enable Nginx

```bash
sudo cp /srv/industrend/app/deploy/industrend.nginx.conf /etc/nginx/sites-available/industrend.in
sudo ln -s /etc/nginx/sites-available/industrend.in /etc/nginx/sites-enabled/industrend.in
sudo nginx -t
sudo systemctl reload nginx
```

After both DNS A records point to the VPS and HTTP works:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d industrend.in -d www.industrend.in
```

Verify renewal:

```bash
sudo certbot renew --dry-run
```
