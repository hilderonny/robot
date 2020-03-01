# Mikrofon vom Roboter zum Browser streamen

## Voraussetzungen

* Raspberry PI 3
* [Rasbian Buster Image](../../docs/README.md#Rasbian-installieren)
* [Netzwerk einrichten](../../docs/README.md#Netzwerk-einrichten)
* [NodeJS](../../docs/README.md#NodeJS-installieren)
* [Bindung an Port 443 erlauben](../../docs/README.md#Bindung-an-Port-443-erlauben)

## Mikrofonboard von Adafruit

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

Neu starten und mit `lsmod | grep snd` prüfen, ob das Modul auch wirklich geladen wurde. Da muss `snd_bcm2835` drinstehen. Jetzt kommt die Kernel-Kompilierung dran.

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

Danach kann man die Lautstärkeregelung für das Mikrofon nach [dieser Anleitung](https://learn.adafruit.com/adafruit-i2s-mems-microphone-breakout/raspberry-pi-wiring-and-test#adding-volume-control-5-67) 
einrichten. Beim Aufnehmen, bevor alsamixer gehen kann, muss man mindestens einmal aufnehmen. Dabei aber anstelle von `plughw:1` die gerade eingerichtete Karte `dmic_sv`verwenden:

```
arecord -D dmic_sv -c2 -r 48000 -f S32_LE -t wav -V stereo -v file_stereo.wav
arecord -D dmic_sv -c2 -r 48000 -f S32_LE -t wav -V stereo | aplay -
```

Bis zu einer Verstärkung von 57 geht alsamixer mit, danach fängt die Aufnahme an zu fiepen. Auch mit direkter 3.3V Stromversorgung aus dem Netzteil wird es nicht besser.

## Audio und Video streamen

Das ist im Prinzip recht einfach, indem per NodeJS (siehe Projekt in diesem Verzeichnis) arecord als Prozess aufgerufen und dessen Ausgabe direkt über eine URL gestreamt wird. Im Browser wird dann einfach ein `audio` - Tag eingefügt, dessen src direkt auf diese URL zeigt.

```
npm install
node eindex.js
```

Als Ansatz habe ich diese Quellen hier verwendet:

* https://stackoverflow.com/questions/28193491/node-js-streams-audio-only-when-alsas-arecord-stops-recording
* https://github.com/vincentsaluzzo/node-microphone/blob/master/index.js
* http://www.jingpingji.com/blog/2015/8/4/transferring-sound-data-with-binaryjs-and-buffering-for-smooth-playbac
* https://stackoverflow.com/a/26029102

Allerdings scheint es ab und an zu Overruns zu kommen, die sich in kurzen Unterbrechungen äußern. Das erscheint dann auf der Konsole:

```
Recording WAVE 'stdin' : Signed 32 bit Little Endian, Rate 48000 Hz, Stereo
+################ 51%|58%####################+ overrun!!! (at least 1187.471 ms long)
+################ 51%|58%####################+ overrun!!! (at least 40.356 ms long)
```

Möglicherweise liegt das daran, dass nicht schnell genug gestreamt wird. Eventuell mal mit Komprimierung wie [hier demonstriert](https://github.com/vincentsaluzzo/node-microphone/blob/master/index.js) probieren.
