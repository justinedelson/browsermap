#!/bin/bash
# sample script for building BrowserMap on Jenkins; adjust to your own needs
export PATH="/Users/Shared/Jenkins/.nvm/v0.8.18/bin:$PATH"
export JAVA_HOME="`/usr/libexec/java_home`"
source /Users/Shared/Jenkins/.nvm/nvm.sh
nvm use 0.8.18
rm -rf node_modules
npm install
grunt package