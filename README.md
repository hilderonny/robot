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

# Verzeichnisse

|Verzeichnis|Inhalt|
|---|---|
|avatar|Fernsteuerung á la Avatar. Diese Projekt läuft auf dem Raspberry PI 4|

# Aufgaben der einzelnen Himbeeren

|Knoten|IP extern|IP intern|Aufgabe|
|---|---|---|---|
|odroid|192.168.178.44|10.0.0.2|Kameras streamen, Mikrofon, Lautsprecher|
|pi1|192.168.178.53|10.0.0.1|Gateway WLAN internes LAN, Webserver, Display|
|pi2|-|10.0.0.3|Kopf- und Armsteuerung|

# Ideen

## Kopfrotation

Die Videokugel an der Kamera befestigen, damit sie sich mitdreht.

Kopfrotation auslesen und ... irgendwo hin schicken, Socketverbindung zu Pi, der Kopf steuert. Soll der oben links sein.

Testprogramm schreiben, mit dem ich im Browser per Slider den Kopf bewegen kann.

Danach Testprogramm, um in 3D mit Kamerarotation den Kopf zu drehen. Zum Schluss dann in VR

Die Oculus Go sollte auch schon ausreichend für die Kopfsteuerung sein.

## Kinematik

Anstatt mit Matrizen komplizierte Kinematik zu berechnen, nutze ich feste Nachschlagespeicher: Zu jedem erreichbaren XYZ-Punkt speichere ich die Winkeleinstellungen der Gelenke. Danach muss ich diese nur wieder nachschlagen.

Ermitteln kann ich das so: Ich gebe dem Roboter den Controller der Quest in die Hand und setze ihm die Brille auf. Danach starte ich ein Programm, welches die Stellwinkel der Gelenke variiert und dabei die Position des Controllers ermittelt. Beides speichere ich ab und kann hinterher nachschlagen.

Somit brauche ich keine komplizierte Mathematik, nur etwas Zeit zum Kalibrieren.

## TODOs

Das Google Drive Dokument soll durch eine Sammlung von README.md's ersetzt und in gitlab gespeichert werden.

Die Struktur in gitlab muss ich dazu überarbeiten :
* Tests für Technologien
* konkrete Implementierungen
* Bauanleitungen
* 3D Druckvorlagen