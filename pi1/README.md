# Installation

Als root anmelden und Edimax WLAN Adapter einstecken.

```sh
echo > /etc/network/interfaces <<< EOM
auto wlan1
iface wlan1 inet dhcp
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

echo > /etc/wpa_supplicant/wpa_supplicant.conf <<< EOM
network={
    ssid="SKYNET"
    psk="schneemann"
}
EOM

/etc/init.d/networking restart

apt-get install dnsmasq

echo > /etc/dnsmasq.conf <<< EOM
domain-needed
bogus-priv
interface=eth0
interface=wlan0
no-dhcp-interface=wlan1
dhcp-range=interface:eth0,10.0.0.2,10.0.0.250,infinite
dhcp-range=interface:wlan0,10.0.1.2,10.0.1.250,infinite
dhcp-host=b8:27:eb:e9:e7:b8,pi2,10.0.0.2,infinite
dhcp-host=b8:27:eb:2f:63:13,pi3,10.0.0.3,infinite
dhcp-host=b8:27:eb:98:79:f9,pi4,10.0.0.4,infinite
dhcp-host=00:23:54:1f:f4:6f,TouchSmart,10.0.0.250,infinite
EOM

echo > /etc/network/interfaces <<< EOM
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
up /sbin/iptables -F
up /sbin/iptables -X
up /sbin/iptables -t nat -F
up iptables -A FORWARD -o wlan1 -i eth0 -s 192.168.0.0/24 -m conntrack --ctstate NEW -j ACCEPT
up iptables -A FORWARD -o wlan1 -i wlan0 -s 192.168.0.0/24 -m conntrack --ctstate NEW -j ACCEPT
up iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
up iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE
up sysctl -w net.ipv4.ip_forward=1
up /etc/init.d/dnsmasq restart
EOM

/etc/init.d/networking restart

apt-get update
apt-get install git
git config --global user.name "hilderonny"
git config --global user.email "gitlab@hildebrandt2014.de"
mkdir /gitlab
mkdir /gitlab/hilderonny-robot
git clone https://hilderonny@gitlab.com/hilderonny-robot/pi1.git /gitlab/hilderonny-robot/pi1
```

# Links
* [Router HowTo](https://wiki.ubuntuusers.de/Router/)
