# Mikrofon vom Roboter zum Browser streamen

## Voraussetzungen

* Raspberry PI 3
* [Rasbian Buster Image](../../docs/README.md#Rasbian-installieren)
* [Netzwerk einrichten](../../docs/README.md#Netzwerk-einrichten)
* [NodeJS](../../docs/README.md#NodeJS-installieren)
* [Bindung an Port 443 erlauben](../../docs/README.md#Bindung-an-Port-443-erlauben)

## FFMPG + MJPEG

Ich versuche das erst mal nach [dieser Anleitung](https://www.npmjs.com/package/pipe2jpeg) mit ffmpeg und NodeJS. NodeJS deshalb, weil ich ja für die anderen Teile bereits NodeJS einsetze und ich damit das Problem mit mehreren Sockets bei einer sicheren Verbindung vermeide.

* https://www.npmjs.com/package/pipe2jpeg
* https://github.com/grinkus/mjpeg-stream-server/blob/master/index.js


```

```