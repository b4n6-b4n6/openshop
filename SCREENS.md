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
  * "AVAILABLE QUANTITY" (integer number input)
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
    * available quantity (number)
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
  * "AVAILABLE QUANTITY" (integer number input)
  * 
  * "UPDATE" (button)
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
    * 
    * "AVAILABLE QUANTITY" (text)
    * available quantity (number)
    * 
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
  * 
  * "AVAILABLE QUANTITY" (text)
  * available quantity (number)
  * 
  * "PURCHASE QUANTITY" (integer number input)
  * "PURCHASE" (button)
  * "BACK" (button)

## Shared orders screens

**VIEW ORDER SCREEN**  
Pressing "PURCHASE" or "VIEW" would yield a screen where is displayed
  * product name (text)
  * product photo (image)
  * product description (rich text)
  * 
  * "PAYMENT DETAILS" (text)
  * deposit invoice qr code (image)
  * deposit address (text)
  * 
  * deposit amount in btc (number)
  * "XMR" (text)
  * 
  * deposit amount in currency (number)
  * currency (text)
  * "PURCHASE QUANTITY" (text)
  * quantity (number)
  * 
  * one of
    * "BLOCKCHAIN TRANSACTION CONFIRMED" (text) (when tx confirmed)
    * "BLOCKCHAIN TRANSACTION CONFIRMING (N/M)" (text)
      * N = number of current confirmations
      * M = number of required confirmations
    * "BLOCKCHAIN TRANSACTION NOT DETECTED" (text)
  * txid (text)
  * 
  * "BACK" (button)

**VIEW ORDERS SCREEN**  
Pressing "ORDERS" or "VIEW MY ORDERS" would yield a screen where is displayed
  * orders (list) where each item is displayed
    * product name (text)
    * product photo (image)
    * price (number)
    * currency (text)
    * quantity (number)
    * txid (text)
    * creation datetime (text)
    * 
    * "VIEW" (button)
  * 
  * "BACK" (button)

## Shared chat screens

**CHATS SCREEN**
  * chats (list) where each item is displayed
    * one of
      * shop onion address (text)
      * customer uuid (text)
    * online status indicator
    * last message datetime (text)
    * read/unread state indicator
  * 
  * "BACK" (button)

**CHAT SCREEN**
  * one of
    * shop onion address (text)
    * customer uuid (text)
  * online status indicator
  * messages (list) where each item is displayed, one of
    * text messsage
      * content (text)
      * creation datetime (text)
    * image messsage
      * content (image)
      * creation datetime (text)
    * new order creation message
      * product name (text)
      * product photo (image)
      * price (number)
      * currency (text)
      * txid (text)
      * creation datetime (text)
  * 
  * "TEXT MESSAGE" (text input)
  * "SEND TEXT" (button)
  * "SEND IMAGE" (button)
  * 
  * "BACK" (button)
