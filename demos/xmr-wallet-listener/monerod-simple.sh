#!/bin/bash

monerod \
  --log-file ./wallet/monerod.log \
  --enable-dns-blocklist \
  --no-igd \
  --check-updates disabled \
  --bootstrap-daemon-address auto \
  --no-sync \
  --out-peers 16 \
  --non-interactive \
  --max-concurrency 4
