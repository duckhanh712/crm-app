#!/bin/sh -eu

cat <<EOF
window.REACT_APP_PORT=${PORT};
window.API_DOMAIN="${API_DOMAIN}";
window.CHOZOI_API="${CHOZOI_API}";
EOF
