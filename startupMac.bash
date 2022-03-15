#!/bin/bash

cd server
xterm -e nodemon index.js
cd ../client
xterm -e npm start