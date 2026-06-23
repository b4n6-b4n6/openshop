#!/bin/bash

# Indicates whether the local monero daemon is in a loading state or not
curl \
  --no-progress-meter \
  http://127.0.0.1:18081/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' \
  -H 'Content-Type: application/json' | jq '.result.synchronized'

# Result is boolean