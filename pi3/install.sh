#!/bin/sh
# Initialisiert GIT und laedt hilderonny-robot
# nach /data/gitlab/hilderonny-robot/pi3 herunter

REPO=pi3

apt-get update
apt-get install git
git config --global user.name "hilderonny"
git config --global user.email "gitlab@hildebrandt2014.de"
mkdir -p /gitlab/hilderonny/robot
git clone https://hilderonny@gitlab.com/hilderonny/robot/$REPO.git //gitlab/hilderonny/robot/$REPO
chmod +x /gitlab/hilderonny/robot/$REPO/update.sh
sh /gitlab/hilderonny/robot/$REPO/update.sh

echo "Setting up daemon ..."
cat > /etc/systemd/system/pi3.service << EOM
[Unit]
Description=PI 3 Hauptprogramm
After=network.target
[Service]
Type=idle
ExecStart=/usr/bin/python /gitlab/hilderonny/robot/pi3/camserver.py
[Install]
WantedBy=default.target
EOM
chmod 644 /etc/systemd/system/pi3.service
systemctl enable pi3.service
systemctl daemon-reload
systemctl start pi3.service

echo "Fertig"
