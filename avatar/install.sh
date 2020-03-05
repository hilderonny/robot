#!/bin/sh

# Bibliotheken installieren, NodeJS nach https://github.com/nodesource/distributions#installation-instructions
apt install libasound2-dev python-pip python-opencv
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
apt install -y nodejs

# Python-Dienst für Kamera und Mikrofone (Port 80)
cat > /etc/systemd/system/avatarpython.service << EOM
[Unit]
Description=Avatar Python
After=network.target
[Service]
Type=idle
WorkingDirectory=/home/pi/robot/avatar/python/
ExecStart=/usr/bin/python /home/pi/robot/avatar/python/avatarpython.py
[Install]
WantedBy=default.target
EOM
cd /home/pi/robot/avatar/python
pip install flask
chmod 644 /etc/systemd/system/avatarpython.service
systemctl enable avatarpython.service
systemctl daemon-reload
systemctl start avatarpython.service

# NodeJS-Dienst für Tonausgabe und Kopfsteuerung (Port 443)
cat > /etc/systemd/system/avatarnodejs.service << EOM
[Unit]
Description=Avatar NodeJS
After=network.target
[Service]
Type=idle
WorkingDirectory=/home/pi/robot/avatar/nodejs/
ExecStart=/usr/bin/nodejs /home/pi/robot/avatar/nodejs/avatarnodejs.js
[Install]
WantedBy=default.target
EOM
cd /home/pi/robot/avatar/nodejs
npm install
chmod 644 /etc/systemd/system/avatarnodejs.service
systemctl enable avatarnodejs.service
systemctl daemon-reload
systemctl start avatarnodejs.service
