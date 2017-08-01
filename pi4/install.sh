#!/bin/sh
# PI 4 ist der Steuerer fuer die Kopfservos

echo "Installing PI 4..."

echo "Installing packages ..."
apt-get install python python-smbus i2c-tools python-pip python-dev
pip install --upgrade adafruit-pca9685

echo "Setting up daemon ..."
cat > /etc/systemd/system/pi4.service << EOM
[Unit]
Description=PI 4 Hauptprogramm
After=network.target
[Service]
Type=idle
ExecStart=/usr/bin/python /gitlab/hilderonny/robot/pi4/pi4.py
[Install]
WantedBy=default.target
EOM
chmod 644 /etc/systemd/system/pi4.service
systemctl enable pi4.service
systemctl daemon-reload
systemctl start pi4.service

echo "rebooting ..."
reboot
