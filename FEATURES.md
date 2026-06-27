# Feature implementation details

Notifications (for sure require disabling battery optimisations on android!)
  * Chat text messages (shop owner listens to his onion; shop customer listens to browsed shop onion)
  * Successful orders / confirmed transactions (listen to your monero wallet)

2 indicators should be on the screen most of the time
  * onion/internet connectivity indicator (this will check in the background in short intervals whether we can contact our own onion and display green or red icon depending on result)
  * xmr wallet syncronisation indicator (display green or red or loading to indicate status) (only for shop owner)

QR Code enlargement
  * tapping the QR code icon should display (fullscreen) the QR (onion URL) and tapping one more time will close it

Currency list updating
  * Update in reasonable intervals (10min)
  * Make currency list fetching a brutally blocking behaviour that will block the user screen and input
      with a big spinner until it has been updated and if it fails to fetch block user screen and input indefinitely
      (we never want the user to use the app while it has wrong currency rates)

Purchase flow
  * straightforward/naive solution here - when shop owner app detects confirmed xmr deposit, do 2 things...
    * reduce quantity in owner shop
    * create new order and copy data (from product and include txid)

Chat messages have 2 types
  * text
  * image
  * new order creation

Chat image message enlargement
  * tapping the image message should display (fullscreen) the image and tapping one more time will close it

We do not care to about quantity going negative in edge cases
  * for example, if 2 customers try to buy the same last product
    * quantity will become negative and shop owner will be responsible for returning funds

No escrow or multisig in this version!

Cannot purchase a product if it has quantity less or equal to 0

Please also implement every case where network requests at onions are handled with a timeout in a reasonable time (30 seconds)
and implement these failure codepaths error screens etc
