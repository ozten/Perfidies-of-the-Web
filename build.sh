#!/bin/bash
cd /home/aking/mozilla.com
rm -f js/plugincheck.js js/plugincheck.min.js
cat en-US/firefox/plugincheck/perfidies/plugindetect.js >> js/plugincheck.js
cat en-US/firefox/plugincheck/perfidies/perfidies.js >> js/plugincheck.js
cat en-US/firefox/plugincheck/perfidies/plugincheck.js >> js/plugincheck.js
~/bin/jsmin < js/plugincheck.js > js/plugincheck.min.js
mv js/plugincheck.min.js js/plugincheck.js