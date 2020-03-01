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


Bis jetzt scheint das alles aber nicht zu funktionieren. Aber vielleicht hilft das hier weiter:
- https://stackoverflow.com/questions/28193491/node-js-streams-audio-only-when-alsas-arecord-stops-recording
- https://github.com/vincentsaluzzo/node-microphone/blob/master/index.js
- http://www.jingpingji.com/blog/2015/8/4/transferring-sound-data-with-binaryjs-and-buffering-for-smooth-playbac
- https://stackoverflow.com/a/26029102

Das ganze liegt unter `./audioserver` hier im Repository.
