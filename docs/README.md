# HowTo's

* [Rasbian installieren](#Rasbian-installieren)
* [Netzwerk einrichten](#Netzwerk-einrichten)
* [Bindung an Port 443 erlauben](#Bindung-an-Port-443-erlauben)
* [NodeJS installieren](#NodeJS-installieren)
* [Backup von SD-Karte](#Backup-von-SD-Karte)

## Rasbian installieren

Stand: 26.02.2020

* Image Tool [Balena Etcher](https://www.balena.io/etcher/) runterladen
* [Raspbian Buster](https://www.raspberrypi.org/downloads/raspbian/) Image herunterladen
* Image auf SD Karte schreiben

Vor dem Start das Netzwerk konfigurieren ([Quelle](https://pi-buch.info/wlan-schon-vor-der-installation-konfigurieren/)).

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
Als Anmeldung dient `pi/raspberry`.

## Netzwerk einrichten

## Bindung an Port 443 erlauben

Node kann standardmäßig nicht an Port 443 binden, wenn es als User ausgeführt wird. Aber als root kann mit `arecord` nicht auf das Mikrofon zugreifen. Also muss man hinbekommen, dass man als User an Port 443 binden kann. das geht so ([Quelle](https://superuser.com/a/892391)):

```
sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
```

## NodeJS installieren

Installation als `root` ([Quelle](https://github.com/nodesource/distributions#debinstall)):

```
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt install -y nodejs
```

## Backup von SD-Karte

Das geht am Besten unter Linux

```
dd if=/dev/sdb | gzip > backup.img.gz
```
