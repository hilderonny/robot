# Avatar

Hier baue ich eine Avatar-ähnliche Fernsteuerung für den InMoov Roboter.

Das Kamera-Auge und die Stereomikrofone in den Ohren werden an den Client-Browser gesendet und in die andere Richtung werden die Tonaufnahmen vom Browser durch den Lautsprecher im Mund ausgegeben. Schlussendlich werden die beiden Kopfmotoren gesteuert.

Als Technologien verwende ich:

* Kamerafeed (/python) - Python, OpenCV, multipart-JPEG Stream über HTTP an `img` Tag (kein HTTP**S**)
* Mikrofone (/nodejs) - NodeJS, arecord, WAV Stream über HTTP an `audio` Tag (auch kein HTTP**S**)
* Tonausgabe (/nodejs) - NodeJS, BinaryJS, WebSockets über HTTP**S**
* Motorensteuerung (/nodejs) - NODEJS, WebSockets über HTTP**S**

Die Installation auf ein frisches System kann mit `sudo ./install.sh` aus diesem Verzeichnis erfolgen.

## Status 17.03.2020

Auf der Quest läuft alles sehr ruckelig. Das Videobild ruckt, die kopfbewegungen hacken und die Tonübertragung vom Client zum Roboter laggt und hört sich verzerrt an.

Ich vermutete, dass dies mit der Bandbreite des WebRTC Calls zu tun hatte und habe diesen gesplittet, sodass nur noch Audio übertragen wird und das Videobild als einzeln komprimierte JPEGs im RTC-Datenkanal auf Anfrage verschickt werden. Das funktioniert zwar, bringt aber auf der Quest keine weiteren Vorteile. Läuft alles genauso träge.

Jetzt fallen mir noch diese Probleme und deren Lsungen ein:

* Die WLAN-Verbindung ist zu schwach, wenn der Roboter im Keller steht. Ich hole ihn mal rauf und sehe, was passiert, wenn Quest und Roboter in der Küche oder in der Stube nah bei einander und mit guter Abdeckung laufen
* Die Quest selbst ist zu schwach. Ich probiere das Ganze mal mit der Rift am Rechner aus und sehe, ob sich dann was ändert.
* Der Raspi 4 ist zu schwach, um Videostreaming, Tonausgabe, Kopfsteuerung, GUI mit Chrome und Netzwerk zu handhaben. Ich werde dazu den Server selbst auf dem Raspi weiterlaufen lassen, sodass darüber die HTML-Seiten geliefert werden und die Websockt-Verbindung die Motorsteuerung machen kann. Letztere bleibt ebenfalls auf dem Raspi. Daneben schließe ich aber einen Laptop an, an dem das Stereomikrofon und die Kamera und der Lautsprecher hängen. Dieser ruft die server.html auf und liefert damit Bilder und Ton und gibt sich als J.A.R.V.I.S. Endpunkt aus. Dann sehe ich mal, ob die Quest damit klar kommt und nicht doch ausreichend ist. 

## Status 14.03.2020

Als Nächstes kommt die Kopfsteuerung dran. Dazu werde ich eines der Servo-Boards direkt an den PI 4 anschließen. Das Board dient dann auch nur der Kopfsteuerung (links-rechts, oben-unten, Mund auf-zu und eventuell noch zwinkern) und wird vom gleichen Programm gesteuert, dass auch die Websocket-Verbindung zwischen Roboter und Clients verwaltet.

* [Anleitung Servo-Board mit Raspberry](https://tutorials-raspberrypi.de/mehrere-servo-motoren-steuern-raspberry-pi-pca9685/)
* [I2C mit NodeJS](https://www.npmjs.com/package/i2c-bus)

|Steuerung|Port|I2C Adresse|
|---|---|---|
|Links-Rechts|0||
|Oben-Unten|1||
|Mund|2||

## Status 11.03.2020

In `webrtc.js:73` muss ich die `localSessionDescription.sdp` anpassen, um das Stereomikrofon zu aktivieren.
Da genügt es, per String replace dieses Feld zu aktualisieren.

Vorher:
```
...
a=fmtp:111 minptime=10;useinbandfec=1
...
```

Nachher:
```
...
a=fmtp:111 minptime=10;useinbandfec=1;stereo=1
...
```

Außerdem muss als Constraints in server.html die Echo-Unterdrückung abgeschaltet werden:
```
{"audio":{"optional":[],"mandatory":{"echoCancellation":"false"}},"video":{"optional":[{"minWidth":"1280"},{"minHeight":"720"}],"mandatory":{}}}
```

Allerdings habe ich momentan noch ein Feedback sowohl am Client als auch am Server. Dort werden jeweils die Mic-Streams auch am lokalen Lautsprecher ausgegeben. Bei AppRTC ist das nicht so. Das lag daran, dass für die Thumbnails das lokale Video in einem versteckten Video-Tag angezeigt wurde.

Der Stream vom Client zum Server muss in ein video-Tag im Server ausgegeben werden, damit man am Roboter Ton hört. Allerdings wird beim Stream-Empfang der Video-Track rausgeschnitten, damit man Performance auf dem Roboter spart.

Der Video-Track wird nach Akzeptieren der Verbinsund sowohl am Client (Sender) als auch auf dem Server (Receiver) aus dem Stream entfernt, um Traffic und Performance zu sparen.

## Status 06.03.2020

Mit dem PI 4 habe ich nun endlich ein Erfolgserlebnis.

Ich habe darauf Rasbian installiert, dieses im Desktop-Modus laufen lassen und chromium automatisch simplewebrtc öffnen lassen.

1. Raspbian Buster Image laden
2. Datei **ssh** anlegen
3. Datei **wpa_supplicant.conf** anlegen
4. Per SSH darauf verbinden und `raspi-config` aufrufen
    * VNC Server aktivieren
    * Auflösung auf 1024x768 festlegen
    * Boot im Desktop-Modus mit automatischer Anmeldung als **pi**
5. Mit RealVNC verbinden und automatische Konfiguration durchlaufen lassen (dabei erden Updates installiert)
6. Nach [diesem Blog](https://christian-brauweiler.de/autostart-unter-raspbian/) chromium-Autostart anlegen
    * `Exec=chromium-browser --force-device-scale-factor=1.00 "https://simplevideochat.glitch.me/webrtcdemo.html"
7. simplevideochat einmal per VNC aufrufen und Kameraberechtigung vergeben
8. PI neu starten
9. Per Laptop simplevideochat aufrufen. Verbindung mit PI sollte nach einiger Zeit klappen.

## Status 10.03.2020

Mit dem USB Stereomikrofon geht das Ganze erst mal ganz gut. Allerdings bekomme ich das derzeit nur in Mono hin. Mit [AppRTC](https://github.com/webrtc/apprtc) scheint das aber auch in Stereo zu gehen, wenn man als URL-Parameter https://appr.tc/r/hilderonny?stereo=true&audio=echoCancellation=false angibt.

Dort werden allerdings SDP-Parameter verwendet, die eine noch genauere Stream-Konfiguration ermöglichen. Da sollte ich als Nächstes ansetzen.

## Status 05.03.2020

Mit https://192.168.178.70 geht zumindest mal die Kamera- und Tonaufnahme. Auch die Lautsprecherausgabe geht. ABER:

Allerdings hat die Tonaufnahme eine Verzögerung von etwa 2 Sekunden, was wohl am Browser-Puffern liegt.

Wenn ich den Ton vom Browser zum Server mit 48kHz schicke, fängt das Video an, zu laggen.
Ist also alles in allem keine besonders performante Lösung. Auch die Tatsache, dass die Kameraauflösung bescheiden ist.

Nächster Versuch: Doch wieder einen Laptop nehmen und mit WebRTC eine Direktverbindung aufbauen. Aber wie binde ich dann die Mikrofone ein? Ein Stereo-USB-Mikrofon mit angelöteten Elementen?



# ALT

Fernsteuerung für Roboter mit Video- und Audiofeed vom Roboter zum Client und Audiofeed vom Client zum Roboter. Ausserdem werden Kopfbewegungen gesteuert.

## Prinzipien

Erst mal soll alles so performant wie möglich sein. Das heißt, dass ich nach Möglichkeit auf komplizierte Frameworks verzichten möchte.
Die Kommunikation zwischen Client und Roboter soll schnell sein. Ich versuche, alles über Websockets zu machen. Um hier Verschlüsselungsaufwand zu sparen, werde ich sehen, ob ich die Verbindung auch ohne HTTPS hinbekomme und trotzdem auf das Mikrofon zugreifen kann.

Letztendlich will ich das alles mit der Quest machen. Der Einfachheit halber kann ich die Client-App als AFRAME-App aufbauen.
Falls ich hier aber Probleme mit dem Mikrofon-Zugriff haben sollte, will ich versuchen, eine native Anwendung mit dem Oculus SDK zu bauen. Auf Unity wollte ich nicht zurück greifen, weil mir das zu umfangreich für diesen Anwendungsfall erscheint.

## Verbindung zwischen Server und Client

Ich werden NodeJS und socket.io benutzen. Dabei aber socket.io [zwingen](https://socket.io/docs/client-api/#With-websocket-transport-only), per echten Websockets anstatt long polling zu arbeiten. Nur echte websockets sind performant genug, um Video- und Audiodaten in nahezu Echtzeit zwischen Client und Server bidirektional zu übertragen.

## Videofeed vom Server zum Client

## Audiofeed vom Server zum Client

## Audiofeed vom Client zum Server

Laut [diesem Mozilla Eintrag](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Security) sollte es nicht möglich sein, per Browser auf das Mikrofon zuzugreifen, wenn man die Seite nicht über https lädt. Das macht die Serverimplementierung etwas schwieriger.

Das native Oculus SDK basiert auf einer Android-Anwendung. Ich kann dort also sowas bauen, muss mich dann aber um das Rendern kümmern. Audio nehme ich dann mit Standard-Android-Funktionen auf. Da ich hierbei auf das Android Studio und alle Sicherheitseigenheiten von Android angewiesen binn, kann es sehr viel länger dauern, bis ich zu einem Ergebnis komme. Aber es wird dann vermutlich performanter als eine Browser-Anwendung sein.

https://audio-chat.glitch.me/

Die Übertragung vom Client zum Server habe ich bisher nur mit enorm viel Rauschen hinbekommen. Ich sollte mal  [AudioStreamer](https://github.com/noamtcohen/AudioStreamer) probieren, ob ich damit besser zurecht komme.

Der [AudioStreamer](https://github.com/noamtcohen/AudioStreamer) mit binaryjs hat zumindest auf dem MacBook schon funktioniert. Ich musste da aber die angepasst Client-Bibliothek binary.js benutzen, da das Originale von binaryjs nicht funktionierte. Um speaker.js auf dem Raspberry zum Laufen zu bringen, braucht man `asoundlib.h`, welches man mit `apt install libasound2-dev` erhält. Jupp, wenn man das macht, funktioniert die Übertragung zum Raspberry problemlos.


## Motorensteuerung vom Client zum Server

https://libraries.io/npm/adafruit-pca9685


## Interessante Links
https://developer.oculus.com/documentation/mrc/mr-quest/
https://developer.oculus.com/documentation/native/audio-intro/

https://stackoverflow.com/a/35672668
https://www.npmjs.com/package/socket.io-stream
https://github.com/TooTallNate/node-speaker#readme

