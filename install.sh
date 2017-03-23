#!/bin/sh

# Macht erste Einstellungen und laedt das GitLab-Repository herunter.
# Danach wird je nach Parameter das install-Script im entsprechenden
# Unterverzeichnis aufgerufen.
# Beispielaufruf: install.sh pi1 SSID PSK
# Diese Datei sollte in die boot-Partition einer frischen Raspbian
# ISO kopiert und von dort aus ausgeführt werden, wobei wlan0
# verfuegbar sein sollte.

# Pruefen, ob als root ausgefuehrt
if [ $(id -u) -ne 0 ]; then
        echo "Please run as root or sudo"
        exit 0
fi

# Parameter pruefen, es muss das Unterverzeichnis, die SSID und die PSK angegeben sein
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
        echo "Usage: ./install.sh \"SUBDIRECTORY\" \"SSID\" \"PSK\""
        exit 0
fi

# Globale Variablen festlegen
SUBDIR=$1
SSID=$2
PSK=$3
WPASUPPLICANTFILE=/etc/wpa_supplicant/wpa_supplicant.conf
INSTALLPATH=/gitlab/hilderonny/robot

echo "Configuring network for internet access ..."
cat > $WPASUPPLICANTFILE << EOM
network={
	ssid="$SSID"
	psk="$PSK"
}
EOM
cat > /etc/network/interfaces << EOM
auto wlan0
iface wlan0 inet dhcp
	wpa-conf $WPASUPPLICANTFILE
EOM
echo "Restarting network ..."
ifdown wlan0
ifup wlan0

echo "Enabling SSH ..."
update-rc.d ssh enable
invoke-rc.d ssh start

echo "Installing packages ..."
apt-get update
apt-get --yes --force-yes install git

echo "Cloning repository ..."
mkdir -p $INSTALLPATH
git clone https://hilderonny@gitlab.com/hilderonny/robot.git $INSTALLPATH

echo "Running install script for $SUBDIR ..."
sh $INSTALLPATH/$SUBDIR/install.sh "$SSID" "$PSK"

exit 0