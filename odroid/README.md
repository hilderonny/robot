# ODROID

Bei odroid.com habe ich das [Ubuntu 18.04.3 Image](https://wiki.odroid.com/odroid-xu4/os_images/linux/ubuntu_4.14/ubuntu_4.14)
geladen und mit [Balena Etcher](https://www.balena.io/etcher/) auf eine Karte geschrieben.

Anmelden geht dann mit odroid/odroid oder root/odroid.

## 1. Netzwerk einrichten

Dazu muss vorher der Pi1 als Gateway eingerichtet sein und laufen.
In `/etc/network/interfaces` eintragen:

```
auto eth0
iface eth0 inet static
 address 10.0.0.2
 netmask 255.0.0.0
 network 10.0.0.0
 broadcst 10.0.0.255
 gateway 10.0.0.1
 dns-nameservers 10.0.0.1
```

## 2. gstreamer installieren

```
apt-get install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-doc gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-gtk3 gstreamer1.0-qt5 gstreamer1.0-pulseaudio

mkdir /gitlab
mkdir /gitlab/gstreamer
cd /gitlab/gstreamer
git clone https://gitlab.freedesktop.org/gstreamer/gst-docs.git
```

Beim Kompilieren der Beispiele immer `pkg-config --cflags --libs gstreamer-1.0` mit angeben. Siehe [hier](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c).

Hier ist eventuell ein guter Ansatz: https://gist.github.com/tetkuz/0c038321d05586841897

``` 
gst-launch-1.0 v4l2src device=/dev/video0 ! videoconvert ! videoscale ! video/x-raw,width=320,height=240 ! clockoverlay shaded-background=true font-desc="Sans 38" ! theoraenc ! oggmux ! tcpserversink host=0.0.0.0 port=8080
```

Okay, in Firefox geht der Aufruf von https://192.168.178.53/video.html. In Chrome geht das aus irgendweinem Grunde nicht, siehe https://webmasters.stackexchange.com/questions/108292/why-is-chrome-not-allowing-resources-to-load .
Ich werde wohl über korrektes WebRTC nicht herum kommen. Möglicherweise am Einfachsten, wenn ich auf dem odroid Chrome headless laufen lasse.




# TEMP

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
* [TTS mit Python](https://pypi.python.org/pypi/talkey/0.1.1)