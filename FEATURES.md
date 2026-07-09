# Feature implementation details

Notifications (for sure require disabling battery optimisations on android!)
  * Chat text messages (shop owner listens to his onion; shop customer listens to browsed shop onion)
  * Successful orders / confirmed transactions (listen to your monero wallet)

2 indicators should be on the screen most of the time
  * onion/internet connectivity indicator (this will check in the background in short intervals whether we can contact our own onion and display green or red icon depending on result)
  * xmr wallet syncronisation indicator (display green or red or loading to indicate status) (only for shop owner)

QR Code enlargement
  * tapping the QR code icon should display (fullscreen) the QR (onion URL) and tapping one more time will close it

Purchase flow
  * straightforward/naive solution here - when shop owner app detects confirmed xmr deposit, do 2 things...
    * reduce quantity in owner shop
    * create new order and copy data (from product and include txid)

Chat messages have 2 types
  * text
  * image
  * order status updates: order created
  * order status updates: tx detected
  * order status updates: tx confirmed

Chat image message fuctionality
  * Do not display the image nor a thumbnail. Only offer to download it.

We do not care to about quantity going negative in edge cases
  * for example, if 2 customers try to buy the same last product
    * quantity will become negative and shop owner will be responsible for returning funds

No escrow or multisig in this version!

Cannot purchase a product if it has quantity less or equal to 0
