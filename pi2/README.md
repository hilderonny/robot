# Installation

Als root anmelden.

```sh
echo > /etc/network/interfaces <<< EOM
auto lo
iface lo inet loopback
auto eth0
iface eth0 inet dhcp
EOM
/etc/init.d/networking restart

apt-get update
apt-get install git
git config --global user.name "hilderonny"
git config --global user.email "gitlab@hildebrandt2014.de"
mkdir /gitlab
mkdir /gitlab/hilderonny-robot
git clone https://hilderonny@gitlab.com/hilderonny-robot/pi2.git /gitlab/hilderonny-robot/pi2
```

# Links
