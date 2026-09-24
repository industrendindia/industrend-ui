# Deploy Indus Trend to the VPS

The React document root is `/srv/industrend/app/dist`; Spring Boot runs privately on `127.0.0.1:8080` and Nginx proxies `/api/`.

## Prerequisites

Install Java 21, Maven, PostgreSQL and Nginx. Create the production database and existing application role outside this repository. Run Flyway as that existing role so it owns the isolated `industrendindia` schema.

```bash
sudo install -d -o industrend -g industrend /srv/industrend/app /var/log/industrend
sudo install -d -m 700 /etc/industrend
sudo cp deploy/industrend-api.env.example /etc/industrend/industrend-api.env
sudo chmod 600 /etc/industrend/industrend-api.env
sudo editor /etc/industrend/industrend-api.env
```

Generate `OTP_PEPPER` with `openssl rand -hex 32`. Never commit the environment file.

## Build and migrate

```bash
sudo -u industrend bash -lc '
cd /srv/industrend/app &&
npm ci && npm run build &&
cd backend && ./mvnw clean package
'
```

Starting Spring Boot runs Flyway automatically. Migration `V1__industrendindia.sql` creates only schema-qualified objects in `industrendindia`.

## Enable API and Nginx

```bash
sudo cp /srv/industrend/app/deploy/industrend-api.service /etc/systemd/system/industrend-api.service
sudo cp /srv/industrend/app/deploy/industrend.nginx.conf /etc/nginx/sites-available/industrend.in
sudo ln -sfn /etc/nginx/sites-available/industrend.in /etc/nginx/sites-enabled/industrend.in
sudo systemctl daemon-reload
sudo systemctl enable --now industrend-api
curl -fsS http://127.0.0.1:8080/actuator/health
sudo nginx -t
sudo systemctl reload nginx
```

## MSG91

Keep `MSG91_AUTH_KEY` in `/etc/industrend/industrend-api.env`. Set template/sender dynamically in PostgreSQL:

```sql
UPDATE industrendindia.app_config SET config_value='your-template-id', updated_at=clock_timestamp() WHERE config_key='notification.msg91.template_id';
UPDATE industrendindia.app_config SET config_value='your-sender-id', updated_at=clock_timestamp() WHERE config_key='notification.msg91.sender_id';
UPDATE industrendindia.app_config SET config_value='msg91', updated_at=clock_timestamp() WHERE config_key='notification.provider';
```

The service sees changes within 30 seconds without restart.