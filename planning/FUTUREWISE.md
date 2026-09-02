<code style='color: cyan;'>[Core]</code>
  * make all ext messages ephemeral with a 30 day deletion timer
  * add expiration timer to pending order page
  * fix order shop details update page discarding name & descrption when changing images
  * add owner-only per-order metadata field that can be modified in owners order page
  * add js load based captcha that asks that automatically has the user's browser do js calculations to prove he's a human
  * 
  * referral system - r&d
  * casino/gambling component - r&d

<code style='color: cyan;'>[UI]</code>
  * Improve live chat - r&d
    * reveal new message once a new message appears
    * save and restore scroll position across reloads (probably save when user triggers scroll and load on new page load event)
  * Improve aesthetic
    * Make primary color (everything orange) dynamic - derive a new color from the profile photo
    * Add cute profile pictures to each chat (generated from name uuid)
  * Improved `title` attribute behaviour
    * Add a script that would transform all HTML elements with title attribute into focusable and tappable tooltips

<code style='color: cyan;'>[Android]</code>
  * Release 2 versions
    * tor snowflake auto-configured version
    * regular version

<code style='color: cyan;'>[Refactor]</code>
  * Improve frontend .js files
