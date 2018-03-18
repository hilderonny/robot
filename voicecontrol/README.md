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

