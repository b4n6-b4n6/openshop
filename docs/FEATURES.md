# Feature implementation notes

[Core] No escrow or multisig in this version!

[Core] Purchase flow implementation (alpha)
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

[Core] Image upload implementation (shop banner photo / shop profile photo / product photo) ✅
  * resize to a predefined size based on the HTML container width/height

[UI_Behaviour] QR Code enlargement implementation
  * tapping the QR code icon should display (fullscreen) the QR (onion URL) and tapping one more time will close it

[UI_Behaviour] Chat image message implementation
  * Do not display the image nor a thumbnail. Only offer to download it.

[UI_Behaviour] Rich text input implemetation (for product & shop description)
  * it's a textarea
  * when on view page - parse and display the bbcode (rich text)
  * when on edit page - do not parse bbcode, allow pasting of image into textarea as data uri [img]data:image/...[/img]

[UI_Behaviour] UX loading indicators
  * Image upload containing forms
  * Browser input screen form

[Type] Chat messages have 3 types
  * text
  * image
  * order status change

[Type] Order status has 3 states
  * created
  * incoming payment transaction detected
  * incoming payment transaction confirmed
