# Sprachsteuerung

Hierfür verwende ich das ReSpeaker 4-Mic Array von SeedStudio.

http://www.seeed.cc, BN paypal@hildebrandt2014.d, PW 76048645247

Als erstes brauchen wir PyUSB auf dem PI:

```pip install pyusb```

Danach diese beiden Repositories auf den PI laden:

https://github.com/respeaker/seeed-voicecard
https://github.com/respeaker/mic_array

Im ersten Verzeichnis ```./install.sh``` aufrufen, das installiert die Treiber. Danach PI neu starten.

