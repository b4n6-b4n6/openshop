#!/bin/sh

# redis + imagemagick + postgresql + nodejs 24 + git + tor
pkg install redis
pkg install imagemagick
pkg install postgresql
pkg install nodejs-lts
pkg install tor
pkg install git
npm -g install yarn

git clone https://github.com/b4n6-b4n6/openshop

# postgresql configuration
mkdir -p $PREFIX/var/lib/postgresql
initdb $PREFIX/var/lib/postgresql
createdb "$USER"

# daemons
./bin/termux/start-postgresql.sh &
./bin/termux/start-redis.sh &
