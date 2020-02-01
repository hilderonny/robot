# Sprachsteuerung

Hierfür verwende ich das ReSpeaker 4-Mic Array von SeedStudio.

http://www.seeed.cc, BN paypal@hildebrandt2014.d, PW 76048645247

## Mikrofon einrichten und Richtung erkennen

```
apt-get install git mc python-pip python-pyaudio python-numpy

pip install pixel-ring gpiozero

git clone https://github.com/respeaker/seeed-voicecard

./seeed-voicecard/install.sh

python ./mic_direction.py
```

## Spracherkennung mit PocketSphinx

https://github.com/slowrunner/Pi3RoadTest

https://howchoo.com/g/ztbhyzfknze/how-to-install-pocketsphinx-on-a-raspberry-pi

https://cmusphinx.github.io/wiki/raspberrypi/

https://cmusphinx.github.io/wiki/tutorialam/

```
wget https://sourceforge.net/projects/cmusphinx/files/sphinxbase/5prealpha/sphinxbase-5prealpha.tar.gz/download -O sphinxbase.tar.gz

wget https://sourceforge.net/projects/cmusphinx/files/pocketsphinx/5prealpha/pocketsphinx-5prealpha.tar.gz/download -O pocketsphinx.tar.gz

tar -xzvf sphinxbase.tar.gz

tar -xzvf pocketsphinx.tar.gz

apt-get install bison libasound2-dev swig

cd sphinxbase-5prealpha
./configure --enable-fixed
make && make install

cd ../pocketsphinx-5prealpha
./configure
make && make install

export LD_LIBRARY_PATH=/usr/local/lib 
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
```

Die Python-Bibliotheken werden danach nach ```/usr/local/lib/python2.7/dist-packages/ (sphinxbase,pocketsphinx)``` installiert.

Mit ```cat /proc/asound/cards``` lässt sich heraus finden, welche Nummer das Mikrofon hat. Sollte etwa so aussehen: ```1 [seeed4micvoicec] ...```.


## Oder mit Jasper

http://jasperproject.github.io/documentation/installation/


## Oder mit KALDI

https://github.com/kaldi-asr/kaldi

```
apt-get install automake autoconf libtool subversion libatlas3-base
cd kaldi/tools
extras/check_dependencies.sh

```

## Oder Online mit Mycroft

https://github.com/respeaker/mycroft-core

Endpunkt: https://api.cognitive.microsoft.com/sts/v1.0 (ab 19.03.2018 30 Tage gültig)
Schlüssel 1: f3ced3778b3d4100b23fd39696725649
Schlüssel 2: bf2f1257c10943f4a9a4de14d9ad9c30

```
cd mycroft-core/
cp example_creds.py creds.py
// Schlüssel 1 in creds.py eintragen
```

## Oder ganz anders

https://pypi.python.org/pypi/SpeechRecognition/
https://github.com/Uberi/speech_recognition

```
pip install SpeechRecognition
apt-get install libpulse-dev
pip install pocketsphinx
apt-get install flac
python -m speech_recognition
python microphone_input.py (in diesem Verzeichnis hier)
```

Danach schreibt er zumindest, was ich auf englisch spreche.
Für deutsche Erkennung muss die Datei de-DE.tar.gz nach ```/usr/local/lib/python2.7/dist-packages/speech_recognition/pocketsphinx-data``` entpackt werden.

Mit dem Text "Sag mal warum dauert das so lange." sieht man bei ```python microphone_recognition.py```, dass Sphinx sehr ungenau ist, Google und Bing korrekt antworten und Bing sowohl Großschreibung korrekt macht, als auch konstant zügig antwortet.

Bei noch längeren Sätzen braucht Sphinx eine halbe Ewigkeit. Die erhöhte Dauer bei den Onlinediensten ist wohl auf die Übertragung der WAV-Datei zurück zu führen. Google dauert zwar länger als Bing, scheint dabei aber exaktere Ergebnisse zu liefern, trotz der fehlenden Großschreibung.

# Sprachausgabe

Für schönere Stimmen können MBROLA-Stimmen verwendet werden. Allerdings ist dazu der Hack unten notwendig, da MBROLA auf dem Raspberry nicht verfügbar ist.

```
wget http://steinerdatenbank.de/software/mbrola3.0.1h_armhf.deb (bzw. einfach aus diesem Verzeichnis nehmen)
dpkg -i mbrola3.0.1h_armhf.deb
apt-get install espeak python-espeak mbrola-de6 mbrola-de7 mbrola-de4 mbrola-de5

espeak -s 120 -v mb-de5 --stdout "Ich habe eine wunderschöne Stimme." | aplay -
espeak -v mb-de6 --stdout "Hallo! Ist da oben jemand?" | aplay -
```

In letzter Zeit sind diese Server schlecht erreichbar. Daher habe ich die Installationspakete für mbrola und die Stimmen in dieses Verzeichnis gelegt. Die Installation geht dann so:

```
sudo apt install ./mbrola3.0.1h_armhf.deb
sudo apt install ./mbrola-de6_0.0.20021125+repack2-5_all.deb
```

mb-de5 ist eine gute weibliche und mb-de6 eine gute männliche Stimme.

Zur Verwendung in Python nehme ich os.system und rufe espeak direkt auf. Das scheint mir am einfachsten (hear_and_speak.py).

# Musik streamen

Unter http://borwinius.de/wiki/doku.php?id=linux:audio wird beschrieben, wie man mit der Kommandozeile Musik streamen kann. Geht mit dem Roboter auch ganz gut, der singt dann!

```
mpg123 -C -b 512 http://stream.1a-webradio.de/deutsch/mp3-128/liveradio-1a

// Oder Radio Teddy
mpg123 -C -b 512 http://streamtdy.ir-media-tec.com/live/mp3-128/web/play.mp3
// Oder Sachsensong
mpg123 hoer_off_de_muddi.mp3

// Oder Game music
apt install vorbis-tools
ogg123 http://radio.goha.ru:8000/grindfm.ogg
```

# Kaldi 2020

Inzwischen scheint wich das Kaldi Projekt gemausert zu haben und es gibt auch schon über 400 Stunden Trainingsmaterial für Deutsch.

Unter https://www.raspberrypi.org/forums/viewtopic.php?t=216638 sind wohl auch Prebuilt Binaries für den Raspberry erhältlich.

```
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/libkaldi-asr_5.4.248-3_armhf.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/kaldi-chain-zamia-speech-de_20190328-1_armhf.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/kaldi-chain-zamia-speech-en_20190609-1_armhf.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-kaldiasr_0.5.2-1_armhf.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-espeakng_0.1.5-1_all.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-marytts_0.1.4-1_all.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-num2words_0.5.7-1_all.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-picotts_0.1.2-1_all.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-webrtcvad_2.0.11-4_armhf.deb
wget https://goofy.zamia.org/repo-ai/raspbian/stretch/armhf/python-nltools_0.5.0-1_all.deb

apt install ./libkaldi-asr_5.4.248-3_armhf.deb
apt install ./kaldi-chain-zamia-speech-de_20190328-1_armhf.deb
apt install ./kaldi-chain-zamia-speech-en_20190609-1_armhf.deb
apt install ./python-kaldiasr_0.5.2-1_armhf.deb
apt install ./python-espeakng_0.1.5-1_all.deb
apt install ./python-marytts_0.1.4-1_all.deb
apt install ./python-num2words_0.5.7-1_all.deb
apt install ./python-picotts_0.1.2-1_all.deb
apt install ./python-webrtcvad_2.0.11-4_armhf.deb
apt install ./python-nltools_0.5.0-1_all.deb
apt install pulseaudio-utils pulseaudio

wget http://goofy.zamia.org/zamia-speech/misc/demo_wavs.tgz
wget http://goofy.zamia.org/zamia-speech/misc/kaldi_decode_wav.py
tar xfvz demo_wavs.tgz

python kaldi_decode_wav.py -v demo?.wav
```

Die Installation dauert fast eine Stunde, weil die Kaldi-Pakete riesig sind.
Der Demolauf braucht auch länger. Etwa 4-6 mal so lange, wie der zu erkennende Text.

Die Mikrofonaufnahme wird hier beschrieben: https://github.com/gooofy/zamia-speech/blob/master/README.md#live-mic-demo

```
pactl list sources
// Ausgabe merken, da steht der Gerätename drin
wget http://goofy.zamia.org/zamia-speech/misc/kaldi_decode_live.py
python kaldi_decode_live.py -s 'CM108'
```

Hmm, solange die Erkennung nicht schneller geht (entweder durch bessere Software oder bessere Hardware), komme ich wohl um einen Online-Dienst nicht herum.
Oder ich setze ein Android-Gerät ein, dass mit den Google Algorithmen offline nur die Erkennung macht und die Ergebnisse per lokalem Netz an den PI schickt.
