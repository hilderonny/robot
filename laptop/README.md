# Laptop

Ich habe Ubuntu auf einem Laptop installiert und will dort mit gstreamer und WebRTC die Kamerabilder als Stereovideo streamen.

## Installation

Einfach erst mal Ubuntu ab Version 19 drauf.

Danach *gstreamer* und *gcc* installieren

```
sudo apt-get install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-doc gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-gtk3 gstreamer1.0-qt5 gstreamer1.0-pulseaudio

sudo apt install gcc
```

Zum Kompilieren muss stets die Paketkonfiguration angehangen werden, etwa:

```
gcc basic-tutorial-1.c -o basic-tutorial-1 `pkg-config --cflags --libs gstreamer-1.0`
```

GStreamer arbeitet mit haufenweise [Plugins](https://gstreamer.freedesktop.org/documentation/plugins_doc.html?gi-language=c).

Eventuell benötige ich gar kein eigens kompiliertes Programm, sondern es reicht [gst-launch](https://gstreamer.freedesktop.org/documentation/tools/gst-launch.html?gi-language=c).

```
gst-launch-1.0 playbin uri=https://www.freedesktop.org/software/gstreamer-sdk/data/media/sintel_trailer-480p.webm
```

Hiermit soll das Mergen zweier Video-Streams gehen [Quelle](https://www.noah.org/wiki/gstreamer#mix_two_video_sources_into_one_.28side-by-side.29):
```
gst-launch-1.0 v4l2src device=/dev/video1 ! videoscale ! videoconvert ! video/x-raw-yuv, width=320, height=240 ! videobox border-alpha=0 left=-320 ! videomixer name=mix ! videoconvert ! xvimagesink v4l2src device=/dev/video2 ! videoscale ! videoconvert ! video/x-raw-yuv, width=320, height=240 ! videobox right=-320 ! mix.

```

So hier stellt man die Auflösung der Kamera ein
```
v4l2-ctl --set-fmt-video=width=640,height=360,pixelformat=YUYV -d /dev/video0
v4l2-ctl --all -d /dev/video0
```

Das hier gibt zumindest mal Vorschaufenster, wenn unter X ausgeführt (1. interne Webcam, 2. LiveCam im linken hinteren Port, 3. LiveCam im linken vorderen Port)

```
gst-launch-1.0 v4l2src device=/dev/video0 ! autovideoconvert ! autovideosink
gst-launch-1.0 v4l2src device=/dev/video2 ! autovideoconvert ! autovideosink
gst-launch-1.0 v4l2src device=/dev/video4 ! autovideoconvert ! autovideosink
```


gst-launch-1.0 v4l2src device=/dev/video2 ! videoscale ! autovideoconvert ! videobox border-alpha=0 left=-320 ! videomixer name=mix ! autovideoconvert ! xvimagesink v4l2src device=/dev/video4 ! videoscale ! autovideoconvert ! videobox right=-320 ! autovideosink


gst-launch-1.0 v4l2src device=/dev/video2 ! autovideoconvert ! videobox border-alpha=0 left=-1280 top=-200 ! videomixer name=mix ! xvimagesink v4l2src device=/dev/video4 ! autovideoconvert ! videobox right=-1280 ! mix.

Irgendwie funktioniert das nicht richtig. Einmal werden die Bilder nicht nebeneinander platziert (der Transparenzkanal scheint nicht zu gehen) und dann ist das auch noch arschlangsam und ruckt.

## Mal mit Python probieren

sudo apt-get install python-opencv

Eventuell kann man auch hier einen WebRTC Server bestreiben.
- https://github.com/aiortc/aiortc/tree/master/examples/webcam
- https://github.com/aiortc/aiortc/issues/147#issuecomment-469988058
- https://answers.opencv.org/question/95193/capture-from-two-webcam/?answer=95249#post-id-95249 (Mehrere Threads, um Performance zu erhöhen)

Möglicherweise ist WebRTC auch gar nicht notwendig, wenn ich die aufgenommenen Frames über Sockets schicke. Oder ich leite das Stereobild irgendwie nach /dev/video0815 um und verwende aiortc mit MediaPlayer(/dev/video0815) als Quelle. Sowas hier?

- https://answers.opencv.org/question/96178/gstreamer-output-with-videowriter/
- https://stackoverflow.com/questions/39837806/write-to-dummy-video-stream-using-opencv
- https://stackoverflow.com/questions/34416189/opencv-output-on-v4l2

