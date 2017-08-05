#!/bin/sh

# Richtet den Raspberry als pi1 (Kommunikationsknoten)
# mit Access Point, DNS Server, DHCP Server und
# zentralem Webserver ein, ach ja und mit Audio

echo "Installing dependencies ..."
apt-get install dnsmasq libttspico-utils python python-pip python-flask

echo "Installing DNS server ..."
cat > /etc/dnsmasq.conf << EOM
domain-needed
bogus-priv
interface=eth0
interface=wlan0
no-dhcp-interface=wlan1
dhcp-option=3,10.0.0.1
dhcp-range=interface:eth0,10.0.0.2,10.0.0.250,infinite
dhcp-range=interface:wlan0,10.0.1.2,10.0.1.250,infinite
EOM
cat > /etc/network/interfaces << EOM
auto lo
iface lo inet loopback
auto eth0
iface eth0 inet static
    address 10.0.0.1
    netmask 255.0.0.0
auto wlan0
iface wlan0 inet static
    address 10.0.1.1
    netmask 255.0.0.0
auto wlan1
iface wlan1 inet dhcp
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
up iptables -t nat -F
up iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE
up sysctl -w net.ipv4.ip_forward=1
EOM
/etc/init.d/networking restart

echo "Initializing sound ..."
amixer set PCM -- 80%

echo "Setting up daemon ..."
cat > /etc/systemd/system/pi1.service << EOM
[Unit]
Description=PI 1 Hauptprogramm
After=network.target
[Service]
Type=idle
ExecStart=/usr/bin/node /gitlab/hilderonny/robot/pi1/pi1.js
[Install]
WantedBy=default.target
EOM
chmod 644 /etc/systemd/system/pi1.service
systemctl enable pi1.service
systemctl daemon-reload
systemctl start pi1.service


echo "Done pi1/install"
exit 0
