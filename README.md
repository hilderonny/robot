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

|Knoten|Aufgabe|
|---|---|
|pi1|Zentraler Kommunikationsknoten mit Access Point, DHCP-Server, DNS, Router, Webserver|
|pi2|Linkes Auge|
|pi3|Rechtes Auge|
|pi4|Kopfmechanik|
|laptop|Das wird die Hauptsteuereinheit mit einem leistungsfähigen Laptop. Der soll die Kameras streamen und die anderen Himbeeren koordinieren.|