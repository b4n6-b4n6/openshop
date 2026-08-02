# Feature implementation notes

<code style='color: cyan;'>[Core]</code> No escrow or multisig in this version!

<code style='color: cyan;'>[Core]</code> Purchase flow implementation (alpha)
  * use order payment monero amount to match orders with incoming deposits
  * don't handle race conditions where quantity can become negative
  * don't handle edge conditions where 2 customers might get the same address
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

<code style='color: cyan;'>[Core]</code> Pagination
  * no

<code style='color: cyan;'>[Core]</code> Notifications
  * Chat messages implementation
    * shop owner polls his backend and generates notifications when it finds unread messages
    * customer polls his last visited onion and generates notifications when it finds unread messages

<br><br><br>

<code style='color: cyan;'>[UI_Behaviour]</code> QR Code enlargement implementation
  * tapping the QR code icon should display (fullscreen) the QR (onion URL) and tapping one more time will close it

<code style='color: cyan;'>[UI_Behaviour]</code> Chat image message implementation
  * Do not display the image nor a thumbnail. Only offer to download it.

<code style='color: cyan;'>[UI_Behaviour]</code> Rich text input implemetation (for product & shop description)
  * it's a textarea
  * when on view page - parse and display the bbcode (rich text)
  * when on edit page - do not parse bbcode, allow pasting of image into textarea as data uri [img]data:image/...[/img]

<code style='color: cyan;'>[UI_Behaviour]</code> UX loading indicators
  * Image upload containing forms
  * Browser input screen form✅

<code style='color: cyan;'>[UI_Behaviour]</code>[WIP] 2 indicators on shown owner screen on
  * onion/internet connectivity indicator (this will check in the background in short intervals whether we can contact our own onion and display green or red icon depending on result)
  * xmr wallet syncronisation indicator (display green or red or loading to indicate status) (only for shop owner)

<code style='color: cyan;'>[UI_Behaviour]</code> Add note
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
