# Feature implementation notes

<code style='color: cyan;'>[Core]</code> Purchase flow implementation (alpha) ✅
  * use order payment monero amount to match orders with incoming deposits
  * don't handle race conditions where quantity can become negative in this version
  * 
  * when creating new order
    * products with current quanitity less or equal to 0 cannot be purchased
  * when xmr deposit transaction for associated order is confirmed
    * update order status detected_incoming_tx_at
  * when xmr deposit transaction for associated order is confirmed & unlocked
    * update order status confirmed_incoming_tx_at
    * reduce quantity in owner shop

<code style='color: cyan;'>[Core]</code> Image upload implementation (shop banner photo / shop profile photo / product photo) ✅
  * resize to a predefined size based on the HTML container width/height

<code style='color: cyan;'>[Core]</code> Notifications
  * Chat messages implementation
    * shop owner polls his backend and generates notifications when it finds unread messages
    * shop owner polls his backend and generates notifications when it finds new orders (save previous state, diff with current state)
    * customer polls his last visited onion and generates notifications when it finds unread messages ❌

<code style='color: red;'>[Core]</code> No pagination

<code style='color: red;'>[Core]</code> No escrow or multisig in this version!

<br><br><br>

<code style='color: cyan;'>[UI_Behaviour]</code> QR Code enlargement implementation ✅
  * tapping the QR code icon should display (fullscreen) the QR and tapping one more time will close it
  * implment in 2 locations
    * shop page - for onion address
    * order page - for xmr invoice

<code style='color: cyan;'>[UI_Behaviour]</code> Chat image message implementation ✅
  * Do not display the image nor a thumbnail. Only offer to download it.

<code style='color: cyan;'>[UI_Behaviour]</code> Rich text input implemetation (for product & shop description) ✅
  * it's a textarea
  * when on view page - parse and display the bbcode (rich text)
  * when on edit page - do not parse bbcode, allow pasting of image into textarea as data uri [img]data:image/...[/img]

<code style='color: cyan;'>[UI_Behaviour]</code> UX loading indicators ✅
  * Browser input screen form

<code style='color: cyan;'>[UI_Behaviour]</code> 2 indicators shown on owner screens ✅
  * onion/internet connectivity indicator (display online or offline)
  * xmr wallet syncronisation indicator (display syncing or synced)

<code style='color: cyan;'>[UI_Behaviour]</code> 4 pages with live updates ✅
  * orders list page (at all times)
  * chats list page (at all times)
  * order page (until order is confirmed)
  * chat page (at all times)

<code style='color: cyan;'>[UI_Behaviour]</code> Add note ✅
  * State that this software is strictly prohibited from being used for illegal purposes.

<br><br><br>

<code style='color: cyan;'>[Type]</code> Chat messages have 3 types
  * text
  * image
  * order status change

<code style='color: cyan;'>[Type]</code> Order status has 3 states
  * created
  * incoming payment transaction detected
  * incoming payment transaction confirmed
