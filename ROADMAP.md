# OPENSHOP Roadmap
De-risk first. The UI is the easy ~30%; the project lives or dies on **onion hosting** and
**Monero payment detection on a phone**. So those are priorites first.


## Milestone 1: Monero
`monero_c` **view-only** wallet on a phone, scanning a **remote node over Tor
SOCKS**, derives a **per-order subaddress**, detects a **confirmed** stagenet/testnet deposit
and maps it to the right order.
- **Exit:** deposit reliably detected + confirmed; survives 24h soak backgrounded; correct
  tx→subaddress→order mapping with no cross-order confusion. See

## Milestone 2: Onion-hosting ⟵ also decides the stack
host an onion service on phone A, serve a trivial **JSON** payload, fetch from
phone B over Tor.
- **Exit:** descriptor stays published + payload fetchable across 24h soak, surviving
  backgrounding and a wifi↔cell change (reconnect works)
- **Decisions to be made:**
    - **Option A:** Arti Rust core
    - **Option B:** C-tor

## Milestone 3: Stack chosen + skeleton app
Commit the stack from M1/M2. Start project structure, the **single foreground service**,
connectivity + wallet-sync indicators, currency-rate **hard-block** loader, the 30s
timeout/failure wrapper for all onion I/O.
- **Exit:** app boots, foreground service stays alive, indicators reflect real state, UI is
  blocked until currency rates load.

## Milestone 4: Payment
Wire the M1 wallet into the app: per-order subaddress issuance, confirmed-deposit handler →
decrement quantity + create order (product snapshot + txid). Naive flow, no escrow.
- **Exit:** a real stagenet deposit auto-creates an order on the owner device.

## Milestone 5: Shop protocol + customer browsing
Embedded HTTP server over the onion serving shop/products/media JSON; customer client +
**SQLite cache**; media as content-hash blobs over the onion.
- **Exit:** customer on device B browses a shop on device A and sees products + media from
  cache when the shop later goes offline.

## Milestone 6: Purchase flow end-to-end
Purchase screen → order screen (XMR + currency amount + per-order address) → customer pays →
owner auto-creates order (M4) → both sides reconcile.
- **Exit:** the full end-to-end run passes on two devices over Tor.

## Milestone 7: Chat
WebSocket over onion; customer **signing-key** identity; text / image / order-creation
messages; reconnect + resume via `since=`; fullscreen image + QR enlarge.
- **Exit:** spoofed messages rejected; chat survives circuit churn; notifications fire while the foreground service is alive.

## Milestone 8: Owner & customer screens complete
Fill in all remaining screens from [`FEATURES.md`](FEATURES.md) (edit shop, product CRUD,
orders lists, QR share/enlarge). Manual QA pass.

## Milestone 9: Hardening & release
Failure-path coverage, battery-opt onboarding, threat-model review build + sign **APK**
