# Setup for Linux / OSX

Effectively

Install and/or configure ([linux script](../bin/linux/setup.sh))
- nodejs (24)
- postgresql
- redis
- tor
- imagemagick

Run `yarn install`, then open 6 terminal instances, run in each
- `yarn onion-frontend-dev`
- `yarn local-frontend-dev`
- `yarn wallet-launcher`
- `yarn my-shop-onion-launcher`
- `yarn tor-proxy`
- `yarn notifier`

Open `http://localhost:7001` in a browser and follow screen
