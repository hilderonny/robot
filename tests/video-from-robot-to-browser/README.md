# Video vom Roboter zum Browser streamen

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

Ausgabe von `ffmpeg -f v4l2 -list_formats all -i /dev/video0`:

```
[video4linux2,v4l2 @ 0x21201c0] Compressed:       mjpeg :          Motion-JPEG : 1600x1200 2592x1944 2048x1536 1920x1080 1280x1024 1280x720 1024x768 800x600 640x480 1600x1200
[video4linux2,v4l2 @ 0x21201c0] Raw       :     yuyv422 :           YUYV 4:2:2 : 1600x1200 2592x1944 2048x1536 1920x1080 1280x1024 1280x720 1024x768 800x600 640x480 1600x1200
```

Hier noch ein paar Hinweise von Twitch zum Thema ffmpeg:

https://blog.twitch.tv/en/2017/10/10/live-video-transmuxing-transcoding-f-fmpeg-vs-twitch-transcoder-part-i-489c1c125f28/

## HLS

Mit `/hlstest.js` und `public/hlstest.html` habe ich versucht, einen HLS Stream zu produzieren. Allerdings puffert dieser derart lang, dass diese Art zu Streamen nicht in Frage kommt. Zusätzlich müllt mir diese Lösung die Speicherplatz mit TS-Dateien voll. Auf dem PI3 habe ich mit `top` eine CPU-Last von 175%.

## JPEG Polling

Mit `/jpegtest.js` und `public/jpegtest.html` geht zumindest das Streamen recht flüssig. Die Qualität und Auflösung ist nicht sonderlich berauschend. Jedes Bild ist etwa 30kB groß und es funktioniert mit 10 FPS. Allerdings habe ich auch hier eine Latenz von einer halben Sekunde. Die CPU-Last auf dem Raspberry PI 3 beträgt ungefähr 60%, da ist also noch Luft für andere Tätigkeiten.

TODO: Ich werde nochmal versuchen, mit Python MJPEG zu streame´n. Beim Polling kann ich ja ohne Weiteres auf andere Ports zugreifen, sodass ich NodeJS und Python parallel laufen lassen kann.