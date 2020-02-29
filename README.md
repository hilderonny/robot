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

# NodeJS

Installation als `root` von https://github.com/nodesource/distributions#debinstall:

```
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt install -y nodejs
```

# Mikrofonboard von Adafruit

Nach der Anleitung von [Adafruit](https://learn.adafruit.com/adafruit-i2s-mems-microphone-breakout/raspberry-pi-wiring-and-test) wird momentan nur der Raspi 3 brauchbar unterstützt. Mit dem 4er habe ich es nicht hinbekommen.

![](https://cdn-learn.adafruit.com/guides/cropped_images/000/001/592/medium640/pintou.jpg?1520544902)

In `/boot/config.txt` das hier eintragen:

```
dtparam=i2s=on
```

Zu `/etc/modules` hinzufügen:

```
snd-bcm2835
```

Neu starten und mit `lsmod | grep snd` prüfen, ob das Modul auch wirklich geladen wurde. Da muss `snd_bcm2835` drinstehen.

Jetzt kommt die Kernel-Kompilierung dran.

```
sudo apt update
sudo apt install rpi-update git bc libncurses5-dev bison flex libssl-dev
sudo rpi-update
```

Das dauert etwa 7 Minuten. Danach neu starten. Danach Kernel herunterladen und kompilieren:

```
sudo wget https://raw.githubusercontent.com/notro/rpi-source/master/rpi-source -O /usr/bin/rpi-source
sudo chmod +x /usr/bin/rpi-source
/usr/bin/rpi-source -q --tag-update
rpi-source --skip-gcc
sudo mount -t debugfs debugs /sys/kernel/debug
```

Audio-Modul installieren:

```
git clone https://github.com/PaulCreaser/rpi-i2s-audio
cd rpi-i2s-audio
make -C /lib/modules/$(uname -r )/build M=$(pwd) modules
sudo insmod my_loader.ko
```

Das Modul automatisch laden lassen

```
sudo cp my_loader.ko /lib/modules/$(uname -r)
echo 'my_loader' | sudo tee --append /etc/modules > /dev/null
sudo depmod -a
sudo modprobe my_loader
```

Nach einem Reboot testen:

```
arecord -l
arecord -D plughw:1 -c2 -r 48000 -f S32_LE -t wav -V stereo -v file_stereo.wav
aplay file_stereo.wav
```

Danach kann man die Lautstärkeregelung für das Mikrofon nach [dieser Anleitung](https://learn.adafruit.com/adafruit-i2s-mems-microphone-breakout/raspberry-pi-wiring-and-test#adding-volume-control-5-67) einrichten.

Beim Aufnehmen, bevor alsamixer gehen kann, muss man mindestens einmal aufnehmen. Dabei aber anstelle von `plughw:1` die gerade eingerichtete Karte `dmic_sv`verwnden:

```
arecord -D dmic_sv -c2 -r 48000 -f S32_LE -t wav -V stereo -v file_stereo.wav
```

Bis zu einer Verstärkung von 57 geht alsamixer mit, danach fängt die Aufnahme an zu fiepen.
Eventuell reicht da der Strom nicht mehr aus, den der Raspberry über den 3.3V Port ausgibt.
Ich werde mal probieren, wie weit ich gehen kann, wenn ich die 3.3V direkt vom Netzteil abgreife.

# Audio und Video streamen

Dazu wird ffmpeg als Aufnahmesoftware und mkvserver als Streaming-Server verwendet. Die Installation geht so:

```
sudo apt install ffmpeg libavformat-dev
git clone https://github.com/klaxa/mkvserver_mk2.git
cd mkvserver_mk2
make
```

Um den Port zu ändern, muss man vor `make`in der Datei `server2.c` irgendwo gegen Ende diese Zeile ändern:

```
ainfo.out_uri = "http://0:8080";
```

Den Server mit Audiostream startet man dann (vorausgesetzt, die Mikrofoneinstellungen aus dem vorhergehenden Kapitel funktionieren) hier so:

```
ffmpeg -f alsa -i dmic_sv -f matroska - | ./server
```

Zum Testen auf einem anderen Linux-Gerät:

```
ffplay http://192.168.178.70:8080
```

Bis jetzt scheint das alles aber nicht zu funktionieren. Aber vielleicht hilft das hier weiter:
- https://stackoverflow.com/questions/28193491/node-js-streams-audio-only-when-alsas-arecord-stops-recording
- https://github.com/vincentsaluzzo/node-microphone/blob/master/index.js
- http://www.jingpingji.com/blog/2015/8/4/transferring-sound-data-with-binaryjs-and-buffering-for-smooth-playbac
- https://stackoverflow.com/a/26029102

Das ganze liegt unter `./audioserver` hier im Repository.
