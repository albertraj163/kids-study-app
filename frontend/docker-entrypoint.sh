#!/bin/sh
# Inject API_URL into config.js at container startup (from environment variable)
set -e
API_URL="${API_URL:-http://localhost:3000}"
sed -i "s|__API_URL__|${API_URL}|g" /usr/share/nginx/html/js/config.js
exec nginx -g 'daemon off;'
