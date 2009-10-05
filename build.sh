#!/bin/bash
cd /home/ozten/Projects/mozilla.com
rm -f js/plugincheck.js js/plugincheck.min.js
cat /home/ozten/Projects/Perfidies-of-the-Web/plugindetect.js >> js/plugincheck.js
cat /home/ozten/Projects/Perfidies-of-the-Web/perfidies.js >> js/plugincheck.js
cat /home/ozten/Projects/Perfidies-of-the-Web/plugincheck.js >> js/plugincheck.js
~/bin/jsmin < js/plugincheck.js > js/plugincheck.min.js
mv js/plugincheck.min.js js/plugincheck.js