#!/bin/sh
# Initialisiert GIT und laedt hilderonny-robot
# nach /data/gitlab/hilderonny-robot/pi3 herunter

REPO=pi3

apt-get update
apt-get install git
git config --global user.name "hilderonny"
git config --global user.email "gitlab@hildebrandt2014.de"
mkdir -p /data/gitlab/hilderonny-robot
git clone https://hilderonny@gitlab.com/hilderonny-robot/$REPO.git /data/gitlab/hilderonny-robot/$REPO
chmod +x /data/gitlab/hilderonny-robot/$REPO/update.sh
sh /data/gitlab/hilderonny-robot/$REPO/update.sh
