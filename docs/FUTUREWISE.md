<code style='color: cyan;'>[UI]</code>
  * reduce quantity in purchase flow
  * implement order timing out in purchase flow
  * os specific notifications
    * per convo message
    * per order status change
  * add owner-onlyp per-order metadata field that can be modified

<code style='color: cyan;'>[UI]</code>
  * Improve aesthetic
    * Make primary color (everything orange) dynamic - derive a new color from the profile photo
  * Improved `title` attribute behaviour
    * Add a script that would transform all HTML elements with title attribute into focusable and tappable tooltips
  * Improved UX
    * for all customer pages - Add message ting on order status changes
    * for all customer pages - Add message ting when chat unread status changes

<code style='color: cyan;'>[Refactor]</code>
    * remove product_description from Orders (including tests)

<code style='color: cyan;'>[Android]</code>
  * Ask user to disable battery optimisations
  * Release 2 versions
    * tor snowflake auto-configured version
    * regular version
