#!/bin/bash

PROJ_NAME="cd-user"
cd /var/www/$PROJ_NAME.asdap.africa/public_html/
# git config --global --add safe.directory /var/www/cd-user.asdap.africa/public_html
# git reset --hard
sudo git pull
sudo chown -R www-data /var/www/$PROJ_NAME.asdap.africa/
