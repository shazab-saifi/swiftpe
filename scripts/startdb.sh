#!/bin/bash
set -euo pipefail

docker compose up -d

until docker exec mongo mongosh --quiet --eval "db.adminCommand({ ping: 1 }).ok" >/dev/null 2>&1; do
  sleep 2
done

docker exec mongo /scripts/rs-init.sh
