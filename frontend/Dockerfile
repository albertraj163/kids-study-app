# =============================================================================
# Frontend Dockerfile - Nginx serving static HTML/CSS/JS (non-root user)
# =============================================================================

FROM nginx:1.27-alpine

# Copy static assets
COPY index.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css/
COPY js /usr/share/nginx/html/js/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh && \
    # Nginx runs as non-root in official image when using port > 1024
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
