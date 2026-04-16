#!/bin/bash
set -e

mongosh <<'EOF'
const config = {
  _id: "dbrs",
  version: 1,
  members: [
    {
      _id: 1,
      host: "mongo:27017",
      priority: 3,
    },
  ],
};

try {
  rs.status();
  print("Replica set already initialized");
} catch (_err) {
  rs.initiate(config, { force: true });
}

let isPrimary = false;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    isPrimary = db.hello().isWritablePrimary === true;
    if (isPrimary) {
      break;
    }
  } catch (_err) {}

  sleep(1000);
}

if (!isPrimary) {
  throw new Error("Replica set did not become primary in time");
}

rs.status();
EOF
