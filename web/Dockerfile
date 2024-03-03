FROM caddy:2.7.6-builder AS builder

RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:2.7.6

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

COPY Caddyfile /etc/caddy/Caddyfile

# TODO: Remember to import frontend build

EXPOSE 80 88 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]