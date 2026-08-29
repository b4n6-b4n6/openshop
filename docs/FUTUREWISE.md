<code style='color: cyan;'>[Core]</code>
  * run in android / termux - r&d - 👀
  * referral system - r&d - 👀
  * add owner-only per-order metadata field that can be modified in owners order page
  * fix order shop details update page discarding name & descrption when changing images

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
  * Ask user to disable battery optimisations
  * Release 2 versions
    * tor snowflake auto-configured version
    * regular version

<code style='color: cyan;'>[Refactor]</code>
  * review whether the inclusion of the frontend .js files can be modernised or modulised?
