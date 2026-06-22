Android apk
Minimalism is your best friend✨

INITIAL SCREEN
Opening said appwould yield a screen with 2 options
  * "OPEN NEW SHOP" (button)
  * "BROWSE SHOP" (button)

MY SHOP SCREEN
Pressing "OPEN NEW SHOP" would (after loading) yield a screen where is displayed
  * shop onion ID (text)
  * qr code (tappable icon)
  * shop profile photo (image)
  * shop banner photo (image)
  * shop name (text)
  * shop description (rich text)

  * "CHANGE SHOP NAME" (button)
  * "CHANGE SHOP DESCRIPTION" (button)
  * "CHANGE PROFILE PHOTO" (button)
  * "CHANGE BANNER PHOTO" (button)
  * "VIEW MY PRODUCTS" (button)
  * "VIEW MY ORDERS" (button)
  * "VIEW MY CHATS" (button)

  * "CLOSE SHOP" (button)


ADD PRODUCT SCREEN
Pressing "ADD NEW PRODUCT" would yield a screen where is displayed
  * "NAME" (text input)
  * "DESCRIPTION" (rich input)
  * product photo (image)
  * "CHANGE PRODUCT PHOTO" (button)
  * "CURRENCY" (currency list)
  * "PRICE" (number input)
  * "QUANTITY" (number input)
  * "ADD" (button)
  * "BACK" (button)

VIEW MY PRODUCTS SCREEN
  * products (list) where each item is displayed
    * product name (text)
    * product photo (text)
    * price (number)
    * currency (text)
    * quantity (number)
    * "VIEW" (button)
  "BACK" (button)

VIEW MY PRODUCT SCREEN
  * "NAME" (text input)
  * "DESCRIPTION" (rich input)
  * product photo (image)
  * "CHANGE PRODUCT PHOTO" (button)
  * "CURRENCY" (currency list)
  * "PRICE" (number input)
  * "QUANTITY" (number input)
  * "UPDATE" (button)
  * "BACK" (button)

BROWSE SHOP INPUT SCREEN
Pressing "BROWSE SHOP" would yield a screen where is displayed
  * "SHOP ONION ID" (text input)
  * "ENTER" (button)
  * "BACK" (button)

BROWSER SHOP ONION ERROR SCREEN
Pressing "OPEN" would potentially yield (after loading) an error screen where is displayed
  * "ERROR" (text)
  * "BACK" (button)

BROWSE SHOP SCREEN
Pressing "OPEN" would potentially yield (after loading) a successfully loaded screen where is displayed
  * shop onion ID (text)
  * shop profile photo (image)
  * shop banner photo (image)
  * shop name (text)
  * shop description (rich text)

  * "PRODUCTS" (button)
  * "CHAT" (button)
  * "ORDERS" (button)
  * "BACK" (button)

VIEW PRODUCTS SCREEN
  * products (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * quantity (number)
    * "OPEN" (button)
  * "BACK" (button)

VIEW PRODUCT SCREEN
  * product name (text)
  * product photo (text)
  * product description (rich text)
  * price (number)
  * currency (text)
  * quantity (number)

  * "PURCHASE" (button)
  * "BACK" (button)

PURCHASE SCREEN
  * deposit amount in xmr (number)
  * "XMR" (text)
  * deposit amount in currency (number)
  * currency (text)

CHATS SCREEN
  * ...

CHAT SCREEN
  * ...


Notification features (for sure require disabling battery optimisations on android!)
  * Chats should notify android (listen to onion)
  * Successful purchases should notify android (track monero wallet through view key)

QR Code enlargement feature
  * tapping the QR code should make it large and tapping it again should return

Currency list fetching behaviour
  * Make currency list fetching a brutally blocking behaviour that will block the user screen and input
      with a big spinner until it has been updated and if it fails to fetch block user screen and input

