#!/bin/sh

# Install postgresql + redis + tor + imagemagick + git + nodejs
pkg install redis
pkg install imagemagick
pkg install postgresql
pkg install nodejs-lts
pkg install tor
pkg install git
npm -g install yarn

# Confgiure postgresql access
mkdir -p $PREFIX/var/lib/postgresql
initdb $PREFIX/var/lib/postgresql
createdb "$USER"

# Clone repo
git clone https://github.com/b4n6-b4n6/openshop
cd openshop
yarn install
pm2 start ecosystem.config.js
