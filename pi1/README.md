# TODO

Möglicherweise lassen sich die Videostreams doch mit nur einer Verbindung übertragen, wenn clientseitig `ontrack` anstelle von `onaddstream`
verwendet wird: [https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack).

```js
pc.ontrack = function(event) {
  document.getElementById("received_video").srcObject = event.streams[0];
  document.getElementById("hangup-button").disabled = false;
};
```

Da scheint man für jeden Track des Streams einen eigenen Aufruf zu bekommen und kann dann die Tracks auf unterschiedliche video-Elemente aufteilen.




# PI 1 - Gateway, Webserver, Display

## 1. Image installieren

Am einfachsten ging die Installation des TFT-Displays, indem ich das
[vorgefertigte Image](https://www.waveshare.com/wiki/3.5inch_RPi_LCD_(A)#Image) geladen und
mit [Balena Etcher](https://www.balena.io/etcher/) auf eine Karte geschrieben habe.

SSH ist dabei automatisch installiert und die Anmeldung geht dann mit pi/raspberry.

## 2. Display drehen

Das Display ist hochkant verbaut. Damit auch die grafische Oberfläche so gedreht ist, folgendes eingeben:

```
cd /home/pi/LCD-show
./LCD35-show 90
```

Danach startet das System neu und das DIsplay sollte hochkant anzeigen.

Bisher habe ich es noch nicht hinbekommen, dass der Touch-Screen funktioniert.

## 3. Startseite einrichten

Es wird beim Start immer eine Warnung angezeigt, dass der pi-User noch ein Standardpasswort hat.
Das bekommt man weg, indem man dem pi-User ein anderes Passwort vergibt: pi/pi.

Als Dashboard verwende ich Chromium im Kiosk Modus und zeige eine spezielle URL an, die auf dem lokalen Webserver
liegt. Dazu vorher Chromium installieren.

```
apt install chromium-browser unclutter
```

Dann die Autostart-Datei `/home/pi/.config/lxsession/LXDE-pi/autostart` bearbeiten:

```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@point-rpi

@unclutter

@xset s off
@xset -dpms
xset s noblank

# https://itrig.de/index.php?/archives/2309-Raspberry-Pi-3-Kiosk-Chromium-Autostart-im-Vollbildmodus-einrichten.html
@chromium-browser --incognito --noerrdialogs --ignore-certificate-errors --kiosk http://localhost/dashboard.html
```

Beim nächsten Neustart wird diese URL automatisch angezeigt.

## 4. LAN-Gateway einrichten

Vorher hatte ich einen DHCP-Server eingerichtet, damit die anderen Himbeeren
ihre IP-Adressen bekommen. Das halte ich aber für unnötige Ressourcenverschwendung.
Stattdessen werde ich den Beeren statische IP-Adressen manuell vergeben.

Zuerst wird der WLAN-Access Point in `/etc/wpa_supplicant/wpa_supplicant.conf` konfiguriert:

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
 ssid="SKYNET"
 psk="schneemann"
 key_mgmt=WPA-PSK
}
```

Als nächstes die Netzwerkkonfiguration samt Gateway in `/etc/network/interfaces`:

```
# Loopback device
auto lo
iface lo inet loopback

# Internes Kabelnetzwerk mit 10.0.0.x Adressen
auto eth0
iface eth0 inet static
    address 10.0.0.1
    netmask 255.0.0.0

# WLAN Verbindung zum Hausnetz mit 192.168.178.x Adressen
auto wlan0
iface wlan0 inet dhcp
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

# Firewall zuruecksetzen
up /sbin/iptables -F
up /sbin/iptables -X
up /sbin/iptables -t nat -F

# Routen einrichten
up iptables -A FORWARD -o wlan0 -i eth0 -s 192.168.0.0/24 -m conntrack --ctstate NEW -j ACCEPT
up iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
up iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE
up sysctl -w net.ipv4.ip_forward=1
```

Mit  `/etc/init.d/networking restart` das Netzwerksystem neu starten.

## 5. Webserver einrichten

Dazu erst einmal das Repository klonen. Einfach alles, wir haben ja den Platz.

```sh
apt install git
mkdir /gogs
mkdir /gogs/levelupsoftware
cd /gogs/levelupsoftware
git clone https://gogs.levelupsoftware.de/levelupsoftware/robot.git
```

Als nächstes wird ein SSL Zertifikat generiert, das wir für sichere WebRTC und Websocket-Verbindungen benötigen. Die einzelnen Zertifikateigenschaften sind egal, da das Zertifikat ohnehin nur von uns benutzt wird.

```sh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt
```

Als Server benutze ich direkt ein NodeJS Skript, das auch als Proxy dient. Dann brauche ich nicht extra einen Apache einzurichten. Erst mal NodeJS installieren bzw. aktualisieren (sollte dann mindestens die 8er Version sein). Das geht am Besten, wenn man die vorinstallierte Version komplett entfernt und von den offiziellen [Quellen](https://nodejs.org/en/download/) herunter lädt (ArmV7).

```sh
apt purge nodejs npm
apt autoremove

wget https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-armv7l.tar.xz
tar xf node-v10.16.3-linux-armv7l.tar.xz
cd node-v10.16.3-linux-armv7l
cp -R * /usr/local/
ln -s /usr/local/bin/node /usr/bin/node
ln -s /usr/local/bin/npm /usr/bin/npm
```

Jetzt wird ein Daemon-Skript unter `/etc/systemd/system/pi1.service` eingerichtet.

```
[Unit]
Description=PI 1
After=network.target
[Service]
Type=idle
WorkingDirectory=/gogs/levelupsoftware/robot/pi1/
ExecStart=/usr/bin/node /gogs/levelupsoftware/robot/pi1/pi1.js
[Install]
WantedBy=default.target
```

Und zum Schluss noch den Daemon einrichten, die Paketabhängigkeiten installieren und den
Daemon starten.

```
cd /gogs/levelupsoftware/robot/pi1/
npm install
chmod 644 /etc/systemd/system/pi1.service
systemctl enable pi1.service
systemctl daemon-reload
systemctl start pi1.service
```

## Laptop und Quest

Jetzt kann man am Latop die Kameras anschließen und die Url `/test/webcamserver.html` aufrufen.

Auf der Quest dann `test/quest.html` aufrufen oder da hin navigieren.








Weiter hier:
https://stackoverflow.com/a/56885795



# ALTES ZEUGS


apt-get update
apt-get install git
git config --global user.name "hilderonny"
git config --global user.email "gitlab@hildebrandt2014.de"
mkdir /gitlab
mkdir /gitlab/hilderonny-robot
git clone https://hilderonny@gitlab.com/hilderonny-robot/pi1.git /gitlab/hilderonny-robot/pi1
```

# Audio-Ausgabe

Einstellen der Lautstärke

```
amixer set PCM -- 100%
```

Testausgabe

```
pico2wave -l "de-DE" -w temp.wav "Hallo Welt!" && aplay temp.wav && rm temp.wav
```

# Links
* [Router HowTo](https://wiki.ubuntuusers.de/Router/)
