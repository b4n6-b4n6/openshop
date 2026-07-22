
Notifications
  * Chat messages implementation
    * shop owner polls his backend and generates notifications when it finds unread messages
    * customer polls his last visited onion and generates notifications when it finds unread messages
  * Order status changes

Chat messages have various date fields...
  * read_at works for both shop owner and customer - fairly straightforward implementation
  * received_at works effectively only for shop owner panel (shop customer sent messages)

2 indicators should be on the screen most of the time
  * onion/internet connectivity indicator (this will check in the background in short intervals whether we can contact our own onion and display green or red icon depending on result)
  * xmr wallet syncronisation indicator (display green or red or loading to indicate status) (only for shop owner)

Messages
  received & read receipts

Android
  battery optimisations will need to be disabled
  Release 2 APK's
    * tor snowflake auto-configured version
    * regular version

State that this software is strictly prohibited from being used for illegal purposes.
