#!/bin/sh

# Server starten
BASEDIR=$(dirname $(realpath "$0"))
cd $BASEDIR
sudo /usr/bin/node $BASEDIR/laptop.js &

# Browser oeffnen
IP=$(hostname -I | cut -d ' ' -f 1)
/opt/google/chrome/google-chrome https://$IP/test/webcamserver.html &

# Server in Vordergrund holen
fg