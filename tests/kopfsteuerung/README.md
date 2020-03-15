# Kopfsteuerung mit Raspi 4 und PCA9685

Motoren an den Ports 0 und 1.

Per `raspi-config` muss vorher I2C aktiviert werden.
Dann mit `i2cdetect -y 1` den Bus anzeigen lassen.
Da waren die Adressen `40`und `70` als verfügbar angezeigt.

## Pulse

|Motor|Min|Center|Max|Erkenntnisse|
|---|---|---|---|---|
|Tower Pro SG 90|520|1500|2550|1500 +/- 900|
|Kopfdrehung Port 14|800|1600|2500||
|Kopfneigung Port 13|800|1350|2100||
|Mundöffnung Port 15|1050||1500||
