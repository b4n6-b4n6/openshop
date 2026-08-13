<code style='color: cyan;'>[UI]</code>
  * reduce quantity in purchase flow
  * implement order expiration in purchase flow
  * os specific notifications
    * per convo message
    * per order status change
  * add owner-only per-order metadata field that can be modified in owners order page

<code style='color: cyan;'>[UI]</code>
  * Improve live chat
    * reveal new message once a new message appears
    * save and restore scroll position across reloads (probably save when user triggers scroll and load on new page load event)
  * Improve aesthetic
    * Make primary color (everything orange) dynamic - derive a new color from the profile photo
    * Add cute profile pictures to each chat (generated from name uuid)
  * Improved `title` attribute behaviour
    * Add a script that would transform all HTML elements with title attribute into focusable and tappable tooltips
  * Improved UX
    * for all customer pages - Add message ting on order status changes
    * for all customer pages - Add message ting for every new message that arrives

<code style='color: cyan;'>[Refactor]</code>
  * remove product_description from Orders (including tests)

<code style='color: cyan;'>[Android]</code>
  * Ask user to disable battery optimisations
  * Release 2 versions
    * tor snowflake auto-configured version
    * regular version
