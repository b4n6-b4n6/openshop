#!/bin/sh
sudo apt update
sudo apt install -y curl

# nodejs
# https://nodejs.org/en/download
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24

# postgresql + redis + tor
sudo apt install -y postgresql
sudo apt install -y redis
sudo apt install -y tor
sudo apt install -y git
sudo apt install -y imagemagick

# postgresql access configuration
sudo -u postgres createuser $USER
sudo -u postgres createdb -O $USER $USER
