### OPENSHOP 0.0.0

Unstoppable P2P XMR Markets architecture  
Spin up your own Monero Shop with 1 tap!  
Share your QR code to let others find your shop!  
Sell goods, process orders and receive monero!  
An Android APK  
Minimalism is your best friend✨

# Screens
## Initial screens

**INITIAL SCREEN**  
Opening app would yield a screen with 2 options
  * "OPEN NEW SHOP" (button)
  * "BROWSE SHOP" (button)

**BROWSE SHOP INPUT SCREEN**  
Pressing "BROWSE SHOP" would yield a screen where is displayed
  * "SHOP ADDRESS" (text input)
  * "ENTER" (button)
  * "BACK" (button)

**BROWSE SHOP CONNECTING SCREEN**  
Pressing "ENTER" would yield a screen where is displayed
  * "CONNECTING" (text)
  * loading indicator

**SHOP MONERO WALLET INPUT SCREEN**  
Pressing "OPEN NEW SHOP" would yield a screen where is displayed
  * "MONERO WALLET PRIMARY ADDRESS" (text input)
  * "MONERO WALLET PRIVATE VIEW KEY" (text input)
  * "MONERO WALLET RESTORE BLOCK HEIGHT" (text input)
  * "CREATE" (button)
  * "BACK" (button)

**SHOP OPENING SCREEN**  
Pressing "CREATE" would yield a screen where is displayed
  * "SPINNING UP ONION" (text)
  * loading indicator

**BROWSE SHOP ERROR SCREEN**  
Pressing "ENTER" would potentially yield (after loading) an error screen where is displayed
  * "ERROR" (text)
  * "BACK" (button)

## Shop owner screens

**VIEW MY SHOP SCREEN**  
Pressing "OPEN NEW SHOP" would (after loading) yield a screen where is displayed
  * shop onion address (text)
  * qr code (tappable icon)
  * shop profile photo (image)
  * shop banner photo (image)
  * shop name (text)
  * shop description (rich text)
  * 
  * "EDIT SHOP NAME" (button)
  * "EDIT SHOP DESCRIPTION" (button)
  * "CHANGE PROFILE PHOTO" (button)
  * "CHANGE BANNER PHOTO" (button)
  * "VIEW MY PRODUCTS" (button)
  * "VIEW MY CHATS" (button)
  * "VIEW MY ORDERS" (button)
  * 
  * "CLOSE SHOP" (button)

**EDIT MY SHOP SCREEN**  
Pressing "EDIT SHOP NAME" or "EDIT SHOP DESCRIPTION" would yield a screen where is displayed
  * "SHOP NAME" (text input)
  * "SHOP DESCRIPTION" (rich text input)
  * 
  * "UPDATE" (button)
  * "BACK" (button)

**ADD MY PRODUCT SCREEN**  
Pressing "ADD NEW PRODUCT" would yield a screen where is displayed
  * "NAME" (text input)
  * "DESCRIPTION" (rich text input)
  * product photo (image)
  * "CHANGE PRODUCT PHOTO" (button)
  * "CURRENCY" (currency list)
  * "PRICE" (number input)
  * "QUANTITY" (integer number input)
  * 
  * "ADD" (button)
  * "BACK" (button)

**VIEW MY PRODUCTS SCREEN**  
Pressing "VIEW MY PRODUCTS" would yield a screen where is displayed
  * products (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * quantity (number)
    * "EDIT" (button)
  * 
  * "BACK" (button)

**EDIT MY PRODUCT SCREEN**  
  * "NAME" (text input)
  * "DESCRIPTION" (rich text input)
  * product photo (image)
  * "CHANGE PRODUCT PHOTO" (button)
  * "CURRENCY" (currency list)
  * "PRICE" (number input)
  * "QUANTITY" (integer number input)
  * 
  * "UPDATE" (button)
  * "BACK" (button)

**VIEW MY ORDERS SCREEN**  
Pressing "VIEW MY ORDERS SCREEN" would yield a screen where is displayed
  * orders (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * product description (rich text)
    * price (number)
    * currency (text)
    * quantity (number)
    * txid (text)
    * creation datetime (text)
  * 
  * "BACK" (button)

## Shop customer screens

**VIEW SHOP SCREEN**  
Pressing "ENTER" would potentially yield (after loading) a successfully loaded screen where is displayed
  * shop onion address (text)
  * shop profile photo (image)
  * shop banner photo (image)
  * shop name (text)
  * shop description (rich text)
  * 
  * "PRODUCTS" (button)
  * "CHAT" (button)
  * "ORDERS" (button)
  * "BACK" (button)

**VIEW PRODUCTS SCREEN**  
Pressing "PRODUCTS" would yield a screen where is displayed
  * products (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * quantity (number)
    * "PURCHASE" (button)
  * 
  * "BACK" (button)

**PURCHASE PRODUCT SCREEN**  
Pressing "PURCHASE" would yield a screen where is displayed
  * product name (text)
  * product photo (image)
  * product description (rich text)
  * price (number)
  * currency (text)
  * quantity (number)
  * 
  * "PURCHASE QUANTITY" (integer number input)
  * "PURCHASE" (button)
  * "BACK" (button)

**ORDER SCREEN**  
Pressing "PURCHASE" would yield a screen where is displayed
  * deposit amount in xmr (number)
  * "XMR" (text)
  * deposit amount in currency (number)
  * currency (text)
  * ...

**VIEW ORDERS SCREEN**  
Pressing "ORDERS" would yield a screen where is displayed
  * orders (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * quantity (number)
    * txid (text)
    * creation datetime (text)
  * 
  * "BACK" (button)

**CHATS SCREEN**
  * chats (list) where each item is displayed
    * id
    * last message datetime (text)
    * read/unread state indicator
  * 
  * "BACK" (button)

**CHAT SCREEN**
  * id
  * messages (list) where each item is displayed
    * text messsage
      * content (text)
      * creation datetime (text)
    * OR
    * image messsage
      * content (image)
      * creation datetime (text)
    * OR
    * new order creation message
      * product name (text)
      * product photo (image)
      * price (number)
      * currency (text)
      * quantity (number)
      * txid (text)
      * creation datetime (text)
  * 
  * "TEXT MESSAGE" (text input)
  * "SEND TEXT" (button)
  * "SEND IMAGE" (button)
  * "BACK" (button)

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
