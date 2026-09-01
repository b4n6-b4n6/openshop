#!/bin/sh
sudo apt update
sudo apt install -y curl

# Install nodejs (https://nodejs.org/en/download)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
npm -g install yarn

# Install postgresql + redis + tor + imagemagick + git
sudo apt install -y postgresql
sudo apt install -y redis
sudo apt install -y tor
sudo apt install -y git
sudo apt install -y imagemagick

# Configure postgresql access
sudo -u postgres createuser "$USER"
sudo -u postgres createdb -O "$USER" "$USER"

# Clone repo
git clone https://github.com/b4n6-b4n6/openshop
cd openshop
yarn install
pm2 start ecosystem.config.js
