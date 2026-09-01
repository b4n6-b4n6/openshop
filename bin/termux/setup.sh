#!/bin/sh
pkg update -y

# Install postgresql + redis + tor + imagemagick + git + nodejs
pkg install -y redis
pkg install -y imagemagick
pkg install -y postgresql
pkg install -y nodejs-lts
pkg install -y tor
pkg install -y git
npm -g install yarn
npm -g install pm2

# Confgiure postgresql access
mkdir -p $PREFIX/var/lib/postgresql
initdb $PREFIX/var/lib/postgresql

# Clone repo
git clone https://github.com/b4n6-b4n6/openshop
cd openshop
yarn install
pm2 start ecosystem.config.js

echo Sleeping for 5 seconds
sleep 5

USER=$(id -un)
createdb "$USER"

echo Sleeping for 5 seconds
sleep 5

termux-open-url http://localhost:7001
