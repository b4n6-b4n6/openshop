#!/bin/bash

monero-wallet-rpc \
  --log-file ./wallet/monero-wallet-rpc.log \
  --wallet-file ./wallet/wallet \
  --disable-rpc-login \
  --rpc-bind-port 28082 \
  --password "" \
  --daemon-address localhost:18081 \
  --non-interactive
