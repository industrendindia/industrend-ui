# Deploy the React UI

This repository contains only the React storefront. Its document root is `/srv/industrend/app/dist`. The independently deployed identity service listens privately on `127.0.0.1:8081`; Nginx proxies `/api/` to it.

```bash
sudo -u industrend git -C /srv/industrend/app fetch origin
sudo -u industrend git -C /srv/industrend/app switch codex/store-01-image
sudo -u industrend git -C /srv/industrend/app pull --ff-only
sudo -u industrend npm --prefix /srv/industrend/app ci
sudo -u industrend npm --prefix /srv/industrend/app run build
sudo cp /srv/industrend/app/deploy/industrend.nginx.conf /etc/nginx/sites-available/industrend.in
sudo nginx -t
sudo systemctl reload nginx
```

Backend services live in separate `industrendindia/industrend-*-service` repositories and must be deployed independently. Never place service secrets in this repository.
