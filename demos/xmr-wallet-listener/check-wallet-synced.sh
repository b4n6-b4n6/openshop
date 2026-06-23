#!/bin/bash

# Indicates daemon height
curl \
  --no-progress-meter \
  http://127.0.0.1:18081/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' \
  -H 'Content-Type: application/json' | jq '.result.height'

# Indicates wallet height
curl \
  --no-progress-meter \
  -X POST http://127.0.0.1:28082/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_height"}' \
  -H 'Content-Type: application/json' | jq '.result.height'

# wallet is synced when these heights match