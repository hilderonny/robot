# Sprachsteuerung

Hierfür verwende ich das ReSpeaker 4-Mic Array von SeedStudio.

http://www.seeed.cc, BN paypal@hildebrandt2014.d, PW 76048645247

Als erstes brauchen wir PyUSB auf dem PI:

```pip install pyusb```

Danach diese beiden Repositories auf den PI laden:

https://github.com/respeaker/seeed-voicecard
https://github.com/respeaker/mic_array
https://github.com/respeaker/pixel_ring
https://github.com/respeaker/4mics_hat

Im ersten Verzeichnis ```./install.sh 4mic``` aufrufen, das installiert die Treiber. Danach PI neu starten.


apt-get install alsa-utils
apt-get install screen
apt-get install espeak
apt-get install libttspico-utils
apt-get install python python-pip python-usb
echo "snd_bcm2835" > /etc/modules

espeak "Hello world"

- raspi-config: SSH Server aktivieren, Audio über Klinke ausgeben lassen, SPI aktivieren

apt-get install libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev python-dev
pip install pyaudio gpiozero numpy pixel_ring google-assistant-library


BRANCH=next rpi-update (https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=44044&start=425#p919426), damit SSH über eingebautes WIFI geht


