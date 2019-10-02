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