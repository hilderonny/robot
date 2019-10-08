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