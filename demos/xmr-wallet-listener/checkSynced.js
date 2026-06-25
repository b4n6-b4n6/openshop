/*

monerod get_info looks like
curl \
  --no-progress-meter \
  http://127.0.0.1:18081/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' \
  -H 'Content-Type: application/json'


monerod + monero-wallet-rpc implementation for checking wallet status

monerod get_info needs to evaluate to
offline: false
synchronized: true
busy_syncing: false
target_height: 0
status: "OK"

monero-wallet-rpc looks like

curl \
  --no-progress-meter \
  -X POST http://127.0.0.1:28082/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_height"}' \
  -H 'Content-Type: application/json' | jq '.result.height'

monero-wallet-rpc get_height needs to evaluate to monerod get_info's height

*/
