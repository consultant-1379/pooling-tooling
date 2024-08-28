#!/bin/sh

echo "********************************************************"
echo "*       Angular : Transferring Test Report Data        *"
echo "********************************************************"
echo -e "\n"

echo "COMMAND: cp -r /user/source/app/.nyc_output /usr/src/app/out"
cp -r /user/source/app/.nyc_output /usr/src/app/out
