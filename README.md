# Installation

Je nachdem, welche Funktion die Himbeere ausführen soll, wird ein anderes
Unterverzeichnis initialisiert. Das wird mit `install.sh` gemacht:

* Raspbian Jessie Lite Image auf USB Stick packen ([Win32DiskImager](https://sourceforge.net/projects/win32diskimager/))
* `install.sh` auf den Stick packen
* Himbeere starten und mit *pi/raspberry* LOKAL anmelden (Achtung, englische Tastatur!)
* `sudo passwd` eingeben und dem root ein Passwort vergeben
* Mit root anmelden
* `sh /boot/install.sh *UNTERVERZEICHNIS* *SSID* *PSK*` ausführen, wobei Unterverzeichnis *pi1*, *pi2*, etc. sein kann.
* Freuen

# Aufgaben der einzelnen Himbeeren

|Knoten|IP extern|IP intern|Aufgabe|
|---|---|---|---|
|odroid|192.168.178.44|10.0.0.2|Kameras streamen, Mikrofon, Lautsprecher|
|pi1|192.168.178.53|10.0.0.1|Gateway WLAN internes LAN, Webserver, Display|
|pi2|-|10.0.0.3|Kopf- und Armsteuerung|

# Grundlegende Image-Installation

Stand: 26.02.2020

* Image Tool [Balena Etcher](https://www.balena.io/etcher/) runterladen
* [Raspbian Buster](https://www.raspberrypi.org/downloads/raspbian/) Image herunterladen
* Image auf SD Karte schreiben

Vor dem Start [das Netzwerk konfigurieren](https://pi-buch.info/wlan-schon-vor-der-installation-konfigurieren/).

Auf boot-Partition Datei `ssh` erstellen. Das aktiviert den SSH Server beim Start automatisch.

Ebenfalls auf boot-Partition Datei `wpa_supplicant.conf` mit diesem Inhalt erstellen:

```
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
       ssid="SSID"
       psk="PASSWORD"
       key_mgmt=WPA-PSK
}
```

Danach SD-Karte einstecken und PI starten.
Als Anmeldung dient pi/raspberry.

# Backup von SD-Karte

Das geht am Besten unter Linux

```
dd if=/dev/sdb | gzip > backup.img.gz
```

