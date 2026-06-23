#!/bin/bash

cat ./wallet/primary-address.txt ./wallet/secret-view-key.txt | \
monero-wallet-cli \
  --log-file ./wallet/monero-wallet-cli.log \
  --password "" \
  --restore-height 3683000 \
  --generate-from-view-key ./wallet/wallet \
  --command save
