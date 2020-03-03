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

## Python mit OpenCV

Die Quellen unter `pi2` habe ich nochmal ausprobiert. Wenn ich die Auflösung im `camserver.py` auf 640x480 setze und die JPEG-Qualität auf 25%, bekomme ich eine nahezu latenzfreie Übertragung.

Es geht auch, wenn ich die Auflösung auf 800x600 und die Qualität auf 10% runterschraube. Das scheint dann mit der Übertragungsrate über das Netz zusammen zu hängen.

## TODO
Als nächstes werde ich mal versuchen, die Auflösung generell auf 1024x768 zu setzen, dabei aber nur den sichtbaren Teil eus dem Bild ausschneiden und dann sehen, wie weit ich mit der Qualität hochgehen kann, ohne dass es ruckelt oder laggt. Danach probiere ich diese Vorgehensweise nochmal mit dem PI 4 aus.

Dann kann ich nämlich den Videokram auch auf einen anderen PI auslagern und sogar auf einem anderen Port (8080) wegen der SU-Rechte laufen lassen. Zusätzlich braucht das Videostreamen keine gesicherte Verbindung. Das bedeutet, dass die Übertragung per reinem HTTP nochmal etwas Performance Gewinn bringen kann.

Zu guter Letzt probiere ich nochmal die Performance-Hinweise von hier: https://www.pyimagesearch.com/2015/12/21/increasing-webcam-fps-with-python-and-opencv/