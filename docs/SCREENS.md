# Screens
## Initial screens

**INITIAL SCREEN✅🌟**  
Opening app would yield a screen with 2 options
  * "OPEN NEW SHOP" (button)
  * "BROWSE SHOP" (button)

**BROWSE SHOP INPUT SCREEN✅🌟**  
Pressing "BROWSE SHOP" would yield a screen where is displayed
  * "SHOP ADDRESS" (text input)
  * "ENTER" (button)
  * "BACK" (button)

**SHOP MONERO WALLET INPUT SCREEN✅🌟**  
Pressing "OPEN NEW SHOP" would yield a screen where is displayed
  * "MONERO WALLET PRIMARY ADDRESS" (text input)
  * "MONERO WALLET PRIVATE VIEW KEY" (text input)
  * "MONERO WALLET RESTORE BLOCK HEIGHT" (text input)
  * "CREATE" (button)
  * "BACK" (button)

**SHOP CREATING WALLET SCREEN✅🌟**  
Pressing "CREATE" would yield a screen where is displayed
  * "SPINNING UP ONION" (text)
  * loading indicator

**SHOP SPINNING UP ONION SCREEN✅🌟**  
when wallet creation is finished, it would yield a screen where is displayed
  * "SPINNING UP ONION" (text)
  * loading indicator

**BROWSE SHOP ERROR SCREEN✅🌟**  
Pressing "ENTER" would potentially yield (after loading) an error screen where is displayed
  * "ERROR" (text)
  * "BACK" (button)tested 

## Shop owner screens

**VIEW MY SHOP SCREEN✅🌟**  
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
  * "ADD NEW PRODUCT" (button)
  * "VIEW MY PRODUCTS" (button)
  * "VIEW MY CHATS" (button)
  * "VIEW MY ORDERS" (button)
  * 
  * "CLOSE SHOP" (button)

**EDIT MY SHOP SCREEN✅🌟**  
Pressing "EDIT SHOP NAME" or "EDIT SHOP DESCRIPTION" would yield a screen where is displayed
  * "SHOP NAME" (text input)
  * "SHOP DESCRIPTION" (rich text input)
  * 
  * "UPDATE" (button)
  * "BACK" (button)

**ADD MY PRODUCT SCREEN✅🌟**  
Pressing "ADD NEW PRODUCT" would yield a screen where is displayed
  * "NAME" (text input)
  * "DESCRIPTION" (rich text input)
  * product photo (image)
  * "CHANGE PRODUCT PHOTO" (button)
  * "CURRENCY" (currency list)
  * "PRICE" (number input)
  * "AVAILABLE QUANTITY" (integer number input)
  * 
  * "ADD" (button)
  * "BACK" (button)

**VIEW MY PRODUCTS SCREEN✅🌟**  
Pressing "VIEW MY PRODUCTS" would yield a screen where is displayed
  * products (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * "AVAILABLE QUANTITY" (text)
    * available quantity (number)
    * 
    * "EDIT" (button)
  * 
  * "BACK" (button)

**EDIT MY PRODUCT SCREEN✅🌟**  
  * "NAME" (text input)
  * "DESCRIPTION" (rich text input)
  * product photo (image)
  * "CHANGE PRODUCT PHOTO" (button)
  * "CURRENCY" (currency list)
  * "PRICE" (number input)
  * "AVAILABLE QUANTITY" (integer number input)
  * 
  * "UPDATE" (button)
  * "BACK" (button)

**CHATS SCREEN✅🌟**
  * chats (list) where each item is displayed
    * customer uuid (text)
    * last message datetime (text)
    * read/unread state indicator
  * 
  * "BACK" (button)

## Shop customer screens

**VIEW SHOP SCREEN✅**  
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

**VIEW PRODUCTS SCREEN✅**  
Pressing "PRODUCTS" would yield a screen where is displayed
  * products (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * "AVAILABLE QUANTITY" (text)
    * available quantity (number)
    * 
    * "PURCHASE" (button)
  * 
  * "BACK" (button)

**PURCHASE PRODUCT SCREEN✅**  
Pressing "PURCHASE" would yield a screen where is displayed
  * product name (text)
  * product photo (image)
  * product description (rich text)
  * price (number)
  * currency (text)
  * 
  * "AVAILABLE QUANTITY" (text)
  * available quantity (number)
  * 
  * "PURCHASE QUANTITY" (integer number input)
  * "PURCHASE" (button)
  * "BACK" (button)

## Shared orders screens

**VIEW ORDER SCREEN✅**  
Pressing "PURCHASE" or "VIEW" would yield a screen where is displayed
  * product name (text)
  * product photo (image)
  * product description (rich text)
  * 
  * "PAYMENT DETAILS" (text)
  * deposit invoice qr code (image)
  * deposit address (text)
  * 
  * deposit amount in xmr (number)
  * "XMR" (text)
  * 
  * purchase price (number)
  * purchase currency (text)
  * "PURCHASE QUANTITY" (text)
  * purchase quantity (number)
  * 
  * one of
    * "INCOMING TRANSACTION DETECTED" (text)
    * "INCOMING TRANSACTION CONFIRMED" (text)
  * "DEPOSIT TXID" (text)
  * deposit txid (text)
  * 
  * "CREATED AT" (text)
  * creation datetime (text)
  * 
  * "BACK" (button)

**VIEW ORDERS SCREEN✅**  
Pressing "ORDERS" or "VIEW MY ORDERS" would yield a screen where is displayed
  * orders (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * purchase price (number)
    * purchase currency (text)
    * purchase quantity (number)
    * creation datetime (text)
    * 
    * "VIEW" (button)
  * 
  * "BACK" (button)

## Shared chat screens

**CHAT SCREEN**
  * one of
    * shop onion address (text)
    * customer uuid (text)
  * messages (list) where each item is displayed, one of
    * text messsage
      * content (text)
      * creation datetime (text)
      * received/not received state indicator (only for shop owner and only for messages sent by me)
      * read/unread state indicator (only for messages sent by me)
    * image messsage
      * "download" (button)
      * creation datetime (text)
      * received/not received state indicator (only for shop owner and only for messages sent by me)
      * read/unread state indicator (only for messages sent by me)
    * order status update
      * order status update type, one of
        * "NEW ORDER CREATED"
        * "INCOMING TRANSACTION DETECTED"
        * "INCOMING TRANSACTION CONFIRMED"
      * product name (text)
      * product photo (image)
      * purchase price (number)
      * purchase currency (text)
      * purchase quantity (number)
      * order status update occurance datetime (text)
      * 
      * "VIEW" (button)
  * 
  * "TEXT MESSAGE" (text input)
  * "SEND TEXT" (button)
  * "SEND IMAGE" (button)
  * 
  * "BACK" (button)
