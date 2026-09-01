# Setup for Android + Termux

Effectively

- Install [F-Droid](https://f-droid.org)
- Install [Termux](https://f-droid.org/en/packages/com.termux/)
- Disable battery optimisations for Termux
- Acquire wake lock for Termux
- Open Termux and Run `curl -s https://openshop.free/termux.sh | bash`

## Termux notes
Enable battery optimisations [[1](https://github.com/termux/termux-app#f-droid)]  
> Make sure battery optimizations are disabled for the app, check https://dontkillmyapp.com/ for details on how to do that.  

Don't use Termux from Google Play! [[1](https://github.com/termux/termux-app#google-play-store-experimental-branch)]  
> There is currently a build of Termux available on **Google Play** ... This is under development and has **missing functionality** and **bugs**  

## Hardcore anti-sleep
Enable `Stay awake` from under `Developer options`

