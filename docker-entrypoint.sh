#!/bin/sh -eu
mv "/robots/${ROBOTS_FILE_NAME}" /usr/share/nginx/html/robots.txt
./generate_config_js.sh >/usr/share/nginx/html/assets/js/config.js
nginx -g "daemon off;"
