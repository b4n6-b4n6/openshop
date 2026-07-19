# Feature implementation details

No escrow or multisig in this version!

QR Code enlargement implementation
  * tapping the QR code icon should display (fullscreen) the QR (onion URL) and tapping one more time will close it

Purchase flow implementation
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

Chat image message implementation
  * Do not display the image nor a thumbnail. Only offer to download it.

Chat messages have 3 types
  * text
  * image
  * order status changes

Rich text input implemetation (for product & shop description)
  it's a textarea
  when viewed - parse and display the bbcode (rich text)
  when edited - allow pasting of image into textarea as [img]data:image/...[/img]

Order status has 3 states
  * created
  * incoming payment transaction detected
  * incoming payment transaction confirmed

Image upload implementation (banner photo / profile photo / product photo   )
  * resize to a predefined size based on the HTML container width/height
